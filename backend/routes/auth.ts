import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Otp } from '../models/Otp.js';
import { sendOtpEmail, sendWelcomeEmail } from '../services/emailService.js';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Register user & send OTP
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      if (existing.emailVerified) {
        return res.status(400).json({ error: 'Email is already registered. Please log in.' });
      } else {
        // Resend OTP for unverified user
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otpCode, 8);
        await Otp.deleteMany({ email: email.toLowerCase().trim(), purpose: 'register' });
        await Otp.create({
          email: email.toLowerCase().trim(),
          otpHash,
          purpose: 'register',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
        });
        await sendOtpEmail(email, otpCode, 'register');
        return res.json({ success: true, message: 'Verification OTP sent to your email.', requireOtp: true });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      emailVerified: false,
    });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otpCode, 8);
    await Otp.create({
      email: user.email,
      otpHash,
      purpose: 'register',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(user.email, otpCode, 'register');

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify the 6-digit OTP sent to your email.',
      requireOtp: true,
      email: user.email
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Server error during registration.' });
  }
});

// Verify email OTP
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({ email: cleanEmail, purpose: 'register' });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP has expired or is invalid. Please request a new one.' });
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ error: 'Invalid OTP code entered.' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    user.emailVerified = true;
    await user.save();
    await Otp.deleteMany({ email: cleanEmail, purpose: 'register' });
    await sendWelcomeEmail(user.email, user.name);

    const secret = process.env.JWT_SECRET || 'stockvision-super-secret-jwt-key';
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, secret, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to AI StockVision.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err: any) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: err.message || 'Server error during OTP verification.' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otpCode, 8);
    await Otp.deleteMany({ email: cleanEmail, purpose: 'register' });
    await Otp.create({
      email: cleanEmail,
      otpHash,
      purpose: 'register',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(cleanEmail, otpCode, 'register');
    res.json({ success: true, message: 'New verification OTP sent to your email.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error resending OTP.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    if (!user.emailVerified) {
      // Trigger new OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otpCode, 8);
      await Otp.deleteMany({ email: user.email, purpose: 'register' });
      await Otp.create({
        email: user.email,
        otpHash,
        purpose: 'register',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });
      await sendOtpEmail(user.email, otpCode, 'register');
      return res.status(403).json({
        error: 'Email not verified. A new verification OTP has been sent to your email.',
        requireOtp: true,
        email: user.email
      });
    }

    const secret = process.env.JWT_SECRET || 'stockvision-super-secret-jwt-key';
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, secret, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Server error during login.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Get current user
router.get('/me', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
