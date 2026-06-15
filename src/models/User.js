import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubAccessToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ['developer', 'pm', 'director', 'admin'], 
      default: 'developer',
    },
    workspaceName: {
      type: String,
      trim: true,
      default: '',
    },
    avatarInitials: { 
      type: String, 
      required: true  
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
