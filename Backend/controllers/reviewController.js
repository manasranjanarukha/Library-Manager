const Review = require("../models/review");

exports.createReview = async (req, res, next) => {
  const { bookId, userId, comment } = req.body;

  if (!bookId || !userId || !comment) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if this user already reviewed the book
    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book." });
    }

    // Create the review
    const newReview = await Review.create({
      book: bookId,
      user: userId,
      comment,
    });

    // 👉 Populate user + book so frontend gets complete review object
    const fullReview = await Review.findById(newReview._id)
      .populate("user")
      .populate("book");

    return res.status(201).json(fullReview);
  } catch (err) {
    console.error("❌ Error saving review:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllReviews = async (req, res, next) => {
  const { id } = req.params;

  try {
    const reviews = await Review.find({ book: id })
      .populate("user")
      .populate("book");

    return res.status(200).json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
