const Favorite = require("../models/favorite");
const mongoose = require("mongoose");

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const bookId = req.params.id; // from URL

    // Safety check (prevents CastError)
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    // Save favorite
    const favorite = await Favorite.create({
      user: userId,
      book: bookId,
    });

    res.status(201).json({
      success: true,
      message: "Book added to favorites",
      favorite,
    });
  } catch (error) {
    // Duplicate favorite (unique index hit)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Book already in favorites",
      });
    }

    console.error("Add favorite error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.fetchFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const favorites = await Favorite.find({ user: userId }).populate("book");
    console.log(favorites);

    res.status(200).json({
      success: true,
      favorites,
    });
  } catch (error) {
    console.error("Fetch favorites error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
