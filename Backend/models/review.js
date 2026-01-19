const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book", // <-- links to the Book model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // <-- links to the User model
      required: true,
    },
    // rating: {
    //   type: Number,
    //   required: true,
    //   min: 1,
    //   max: 5,
    // },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true } // auto adds createdAt and updatedAt
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
