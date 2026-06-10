const mongoose = require("mongoose");
const Review = require("./review");
const SaveForLater = require("./saveForLater");
const User = require("./user");

const bookSchema = new mongoose.Schema(
  {
    cover: {
      type: String, // store image URL
      required: true,
    },
    bookFile: {
      type: String, // store book File
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        set: (val) => Math.round(val * 10) / 10,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    pages: {
      type: Number,
      required: true,
      min: 1,
    },
    publishedYear: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    saves: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
