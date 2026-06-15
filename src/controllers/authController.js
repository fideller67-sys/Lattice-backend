import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { HttpStatusCode } from "axios";
import sendOtpEmail from '../utils/emailService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(HttpStatusCode.BadRequest).json({ message: 'Please add all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(HttpStatusCode.BadRequest).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const avatarInitials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatarInitials,
    });

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpSalt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(otp, otpSalt);

      user.otp = hashedOtp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
      await user.save();

      await sendOtpEmail(user.email, otp);

      res.status(HttpStatusCode.Created).json({
        message: 'Registration successful. OTP sent to your email.'
      });
    } else {
      res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    res.status(500).json({ message: 'Server Error. Please try again later.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password'); 

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(HttpStatusCode.Unauthorized).json({ message: 'Please verify your email first' });
      }

      res.status(HttpStatusCode.Ok).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspaceName: user.workspaceName,
        token: generateToken(user.id),
      });
    } else {
      res.status(HttpStatusCode.Unauthorized).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error.message);
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Server Error. Please try again later.' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(HttpStatusCode.BadRequest).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user || !user.otp || !user.otpExpires) {
      return res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid or expired OTP' });
    }

    if (Date.now() > user.otpExpires) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(HttpStatusCode.BadRequest).json({ message: 'OTP has expired' });
    }

    const isMatch = await bcrypt.compare(otp.toString(), user.otp);

    if (isMatch) {
      user.otp = undefined;
      user.otpExpires = undefined;
      user.isVerified = true;
      await user.save();

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspaceName: user.workspaceName,
        token: generateToken(user.id),
      });
    } else {
      res.status(HttpStatusCode.BadRequest).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error in verifyOtp:', error.message);
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Server Error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    res.status(200).json(user);
  } catch (error) {
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Server Error' });
  }
};

const onboardUser = async (req, res) => {
  try {
    const { role, workspaceName } = req.body;
    
    if (!role || !workspaceName) {
      return res.status(HttpStatusCode.BadRequest).json({ message: 'Role and Workspace Name are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(HttpStatusCode.NotFound).json({ message: 'User not found' });
    }

    user.role = role;
    user.workspaceName = workspaceName;
    await user.save();

    res.status(HttpStatusCode.Ok).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      workspaceName: user.workspaceName,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Error in onboardUser:', error.message);
    res.status(HttpStatusCode.InternalServerError).json({ message: 'Server Error' });
  }
};

import axios from 'axios';

const githubLogin = (req, res) => {
  const clientId = process.env['Client-Id'];
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const redirectUri = `${backendUrl}/api/auth/github/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email repo`;
  res.redirect(url);
};

const githubCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const clientId = process.env['Client-Id'];
    const clientSecret = process.env['Client-secret'];

    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      { headers: { accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(400).json({ message: 'GitHub login failed' });
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });
    
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `token ${accessToken}` },
    });
    
    const githubUser = userResponse.data;
    const primaryEmailObj = emailResponse.data.find(e => e.primary);
    const email = primaryEmailObj ? primaryEmailObj.email : githubUser.email;

    if (!email) {
      return res.status(400).json({ message: 'GitHub email not found' });
    }

    let user = await User.findOne({ githubId: githubUser.id.toString() });
    
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.githubId = githubUser.id.toString();
        user.githubAccessToken = accessToken;
        await user.save();
      } else {
        const name = githubUser.name || githubUser.login;
        const avatarInitials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'GH';
        
        user = await User.create({
          name,
          email,
          githubId: githubUser.id.toString(),
          githubAccessToken: accessToken,
          avatarInitials,
        });
      }
    } else {
      user.githubAccessToken = accessToken;
      await user.save();
    }

    const token = generateToken(user.id);
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    if (!user.workspaceName || user.workspaceName === '') {
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&needsOnboarding=true`);
    } else {
      res.redirect(`${frontendUrl}/auth/callback?token=${token}&role=${user.role}`);
    }

  } catch (error) {
    console.error('Error in githubCallback:', error.message);
    res.status(500).json({ message: 'Server Error during GitHub authentication' });
  }
};

const getWorkspaceUsers = async (req, res) => {
  try {
    if (!req.user.workspaceName) {
      return res.status(400).json({ message: 'User must belong to a workspace' });
    }

    const users = await User.find({ workspaceName: req.user.workspaceName }).select('name email role avatarInitials');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getWorkspaceUsers:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

export {
  registerUser,
  loginUser,
  getMe,
  onboardUser,
  githubLogin,
  githubCallback,
  verifyOtp,
  getWorkspaceUsers,
};