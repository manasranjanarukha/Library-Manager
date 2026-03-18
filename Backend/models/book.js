const mongoose = require("mongoose");
const Review = require("./review");
const Favorite = require("./favorite");

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
  { timestamps: true },
  console.log(this.model),
);

// CASCADE DELETE MIDDLEWARE
bookSchema.pre("findOneAndDelete", async function (next) {
  try {
    console.log(this.model);

    const book = await this.model.findOne(this.getFilter());

    if (book) {
      await Review.deleteMany({ book: book._id });
      await Favorite.deleteMany({ book: book._id });

      console.log("Deleted related reviews and favorites");
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;

//   users: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
