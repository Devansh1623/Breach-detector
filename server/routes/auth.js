// server/routes/auth.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

const {
  EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM,
  JWT_SECRET, OTP_EXPIRE_MINUTES, FRONTEND_URL
} = process.env;

if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
  console.warn('Email config missing in env. OTP emails will fail until configured.');
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT || 587),
  secure: Number(EMAIL_PORT) === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: EMAIL_FROM || EMAIL_USER,
    to: email,
    subject: 'Your Breach Detector verification code',
    html: `
      <div>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code expires in ${OTP_EXPIRE_MINUTES || 10} minutes.</p>
        <p>If you didn't request this, please ignore.</p>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
}

// ---------------------------
// SIGNUP
// ---------------------------
router.post('/signup', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: 'Provide email, password and confirmPassword' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        message: 'Account already exists',
        shouldLogin: true
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(
      Date.now() + (Number(process.env.OTP_EXPIRE_MINUTES || 10) * 60 * 1000)
    );

    const user = new User({
      email: email.toLowerCase(),
      password: hashed,
      isVerified: false,
      otp,
      otpExpiry
    });

    await user.save();

    try {
      await sendOtpEmail(user.email, otp);
    } catch (err) {
      console.error('OTP email error:', err);
      return res.status(500).json({ message: 'Failed to send OTP email.' });
    }

    return res.status(200).json({ message: 'OTP sent to email', email: user.email });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------------
// RESEND OTP
// ---------------------------
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + (Number(OTP_EXPIRE_MINUTES || 10) * 60 * 1000));
    await user.save();

    await sendOtpEmail(user.email, otp);

    return res.json({ message: 'OTP resent' });

  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------------
// VERIFY OTP
// ---------------------------
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: 'Email and OTP required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified)
      return res.status(400).json({ message: 'Already verified' });

    if (!user.otp || !user.otpExpiry)
      return res.status(400).json({ message: 'No OTP generated' });

    if (new Date() > user.otpExpiry)
      return res.status(400).json({ message: 'OTP expired' });

    if (user.otp !== String(otp).trim())
      return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: 'Account verified', token });

  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------------
// LOGIN
// ---------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Provide email and password' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.isVerified)
      return res.status(403).json({ message: 'Account not verified. Check your email.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ message: 'Logged in', token });

  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
