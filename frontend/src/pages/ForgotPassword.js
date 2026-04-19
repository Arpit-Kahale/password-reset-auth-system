const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ================= EMAIL CONFIG =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ msg: "User already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({ email, password: hash });

    res.status(201).json({ msg: "Registered successfully" });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    res.json({ msg: "Login successful" });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 🔥 DEBUG LOGS (IMPORTANT)
    console.log("FRONTEND_URL =", process.env.FRONTEND_URL);

    if (!process.env.FRONTEND_URL) {
      console.log("⚠️ FRONTEND_URL IS MISSING IN ENV!");
    }

    const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    console.log("RESET LINK =", link);

    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click below to reset your password:</p>
        <a href="${link}">${link}</a>
        <p>This link expires in 10 minutes.</p>
      `,
    });

    res.json({ msg: "Reset link sent to email" });

  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({ msg: "Password updated successfully" });

  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};