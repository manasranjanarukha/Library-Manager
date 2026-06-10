const Review = require("../models/review");
const User = require("../models/user");
const Book = require("../models/book");

exports.createReview = async (req, res, next) => {
  const { bookId, userId, comment, rating } = req.body;

  if (!bookId || !comment || rating === undefined) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    // Check existing review
    const existingReview = await Review.findOne({
      book: bookId,
      user: userId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this book.",
      });
    }

    // Create review
    const newReview = await Review.create({
      book: bookId,
      user: userId,
      comment,
      rating,
    });

    // Get all reviews for this book
    const reviews = await Review.find({
      book: bookId,
    });

    // Total users
    const totalUser = reviews.length;

    // Sum all ratings
    const totalRating = reviews.reduce((sum, item) => {
      return sum + item.rating;
    }, 0);

    // Calculate average
    const averageRating = totalUser > 0 ? totalRating / totalUser : 0;

    // Update book
    const book = await Book.findById(bookId);

    book.rating.average = averageRating;
    book.rating.count = totalUser;

    await book.save();

    // Populate response
    const fullReview = await Review.findById(newReview._id)
      .populate("user")
      .populate("book");

    return res.status(201).json(fullReview);
  } catch (err) {
    console.error("❌ Error saving review:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getAllReviews = async (req, res, next) => {
  const { id } = req.params;

  try {
    const reviews = await Review.find({ book: id })
      .populate("user")
      .populate("book")
      .populate("rating");

    return res.status(200).json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
