const mongoose = require("mongoose");

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
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
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
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;

//   users: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
