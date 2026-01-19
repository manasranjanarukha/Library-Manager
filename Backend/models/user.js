const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    profilePicture: {
      type: String, // store image URL
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    userType: { type: String, enum: ["Reader", "Author"], default: "Reader" },
    termsAccepted: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
