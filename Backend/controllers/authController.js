const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

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
      profilePicture,
      fullName,
      email,
      confirmPassword,
      password,
      userType,
      termsAccepted,
    } = req.body;

    const allErrors = [];
    if (!errors.isEmpty()) allErrors.push(...errors.array());

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        allErrors.push({ msg: "Email already registered", param: "email" });
      }

      if (allErrors.length > 0) {
        return res.status(422).json({ success: false, errors: allErrors });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        profilePicture: req.files?.profilePicture
          ? req.files?.profilePicture[0]?.filename
          : null,
        fullName,
        email,
        password: hashedPassword,
        userType,
        termsAccepted,
      });

      await user.save();

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
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
    console.log("req session", req.session.user);

    req.session.user = {
      id: user._id,
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
    const currentUserId = req.session.user.id;
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

exports.updateUser = async (req, res) => {
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
    console.log("Updates", updates);

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
};
