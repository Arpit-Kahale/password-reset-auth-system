const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ msg: "User already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({ email, password: hash });

    res.status(201).json({ msg: "Registered successfully" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // ❌ Email not found
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    // ❌ Wrong password
    if (!match) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // ✅ Success
    res.json({ msg: "Login successful" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ FORGOT PASSWORD
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

    const link = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `<p>Click below to reset your password:</p>
             <a href="${link}">${link}</a>`
    });

    res.json({ msg: "Reset link sent to email" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password = hash;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ msg: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};