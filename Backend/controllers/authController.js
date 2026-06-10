const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { deleteUserWithDependencies } = require("../services/userService");
const cleanupUploads = require("../utils/cloudinaryCleanup");
const cloudinary = require("../config/cloudinaryConfig");

exports.register = [
  // 1️⃣ Validation rules
  check("fullName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters long.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Full name must contain only letters and spaces."),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),

  check("userType")
    .isIn(["Author", "Reader"])
    .withMessage("Invalid user type selected."),

  check("termsAccepted")
    .custom((value) => value === true || value === "true")
    .withMessage("You must accept the terms and conditions."),

  // 2️⃣ Controller logic
  async (req, res) => {
    const errors = validationResult(req);

    const {
      fullName,
      email,
      password,
      confirmPassword,
      userType,
      termsAccepted,
    } = req.body;

    const allErrors = [];
    console.log(errors.array());

    if (!errors.isEmpty()) {
      allErrors.push(...errors.array());
    }

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        allErrors.push({ msg: "Email already registered", param: "email" });
      }

      if (allErrors.length > 0) {
        await cleanupUploads(req.files);
        return res.status(422).json({ success: false, errors: allErrors });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        profilePicture: req.files?.profilePicture?.[0]?.path || "",
        fullName,
        email,
        password: hashedPassword,
        userType,
        termsAccepted: termsAccepted === "true", // ✅ FIX
      });

      await user.save();

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
];

exports.Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({
        success: false,
        errors: [{ msg: "Invalid email or password." }],
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).json({
        success: false,
        errors: [{ msg: "Invalid email or password." }],
      });
    }

    // ✅ Set session only here
    req.session.isLoggedIn = true;

    req.session.user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      termsAccepted: user.termsAccepted,
      createdAt: user.createdAt,
      profilePicture: user.profilePicture,
    };

    // If login is successful
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Session error" });
      }

      res.status(200).json({
        success: true,
        message: "Login successful",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.whoAmI = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      loggedIn: false,
      user: null,
    });
  }

  try {
    const currentUserId = req.session.user._id;
    const user = await User.findById(currentUserId).select("-password");

    return res.status(200).json({
      loggedIn: true,
      user,
    });
  } catch (err) {
    console.error("whoAmI error:", err);
    return res.status(500).json({
      loggedIn: false,
      message: "Server error",
    });
  }
};

exports.logout = (req, res) => {
  // If there’s no active session
  if (!req.session) {
    return res.status(200).json({
      success: true,
      message: "Already logged out",
    });
  }

  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }

    // Clear cookie (must match session cookie name)
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

exports.updateUser = [
  check("fullName")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Full name must be at least 5 characters long.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Full name must contain only letters and spaces."),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const userId = req.params.id;

      // Find user
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update fields
      const updates = req.body;

      user = await User.findByIdAndUpdate(userId, updates, { new: true });
      req.session.user.fullName = user.fullName;
      req.session.user.email = user.email;
      req.session.user.userType = user.userType;
      req.session.user.profilePicture = user.profilePicture;
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
      });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during update",
      });
    }
  },
];
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await deleteUserWithDependencies(userId);
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "User deleted but session not destroyed",
        });
      }

      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "User deleted successfully",
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    function generateCaptcha(length = 6) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

      let captcha = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        captcha += chars[randomIndex];
      }

      return captcha;
    }

    const captcha = generateCaptcha();

    user.captcha = captcha;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email is confirmed",
      captcha,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
exports.verifyCaptcha = async (req, res) => {
  const { email, captcha } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.captcha !== captcha) {
      return res.status(400).json({
        success: false,
        message: "Invalid captcha",
      });
    }

    user.captcha = "";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Captcha verified successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
