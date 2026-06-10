const mongoose = require("mongoose");

const saveForLaterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent same user saving same book twice
saveForLaterSchema.index({ user: 1, book: 1 }, { unique: true });

module.exports = mongoose.model("SaveForLater", saveForLaterSchema);
