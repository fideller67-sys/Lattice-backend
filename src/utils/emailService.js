import nodemailer from 'nodemailer';

const sendOtpEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 3000, // Fail fast if SMTP is blocked (e.g. Render free tier)
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Lattice" <noreply@lattice.com>',
      to,
      subject: 'Your Lattice Verification Code',
      text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6; text-align: center;">Lattice Verification Code</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">Please use the following 4-digit code to complete your sign in process:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a; background-color: #eff6ff; padding: 15px 30px; border-radius: 8px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #666;">This code is valid for 10 minutes.</p>
          <p style="font-size: 14px; color: #666;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    // In local dev, if SMTP is not configured, we still want to log the OTP to the console
    console.warn(`[DEV] OTP for ${to} is: ${otp}`);
    return false;
  }
};

export default sendOtpEmail;
