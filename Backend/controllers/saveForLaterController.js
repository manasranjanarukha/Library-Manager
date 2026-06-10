const SaveForLater = require("../models/saveForLater");
const Book = require("../models/book");
const mongoose = require("mongoose");

exports.addSaveForLater = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const bookId = req.params.id; // from URL

    // Safety check (prevents CastError)
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    // Save save for later
    const saveForLater = await SaveForLater.create({
      user: userId,
      book: bookId,
    });

    await Book.findByIdAndUpdate(bookId, { $inc: { saves: 1 } });

    // const savedBooks = await SaveForLater.find();
    // const saveForLaterIds = new Set(savedBooks.map((data) => data.book));
    // console.log(saveForLaterIds);
    // const data = Array.from(saveForLaterIds).reduce((acc, item) => {
    //   acc[item] = (acc[item] || 0) + 1;
    //   return acc;
    // }, {});

    // console.log(data);

    // for (const [bookId, saves] of Object.entries(data)) {
    //   const book = await Book.findById(bookId);
    //   if (book) {
    //     book.saves = saves;
    //     await book.save();
    //     console.log(`Updated ${bookId}: ${saves} saves`);
    //   }
    // }

    res.status(201).json({
      success: true,
      message: "Book added to save for later",
      saveForLater,
    });

    // Count Saves

    // ////////////////////////////////////////
  } catch (error) {
    // Duplicate save for later (unique index hit)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Book already in save for later",
      });
    }

    console.error("Add save for later error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.fetchSaveForLater = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const saveForLaters = await SaveForLater.find({
      user: userId,
    }).populate({
      path: "book",
      select: "title cover saves author status",
      match: {
        status: "published",
      },
      populate: {
        path: "author",
        select: "fullName email",
      },
    });

    const result = saveForLaters.filter((item) => item.book);
    res.status(200).json({
      success: true,
      saveForLaters,
    });
  } catch (error) {
    console.error("Fetch save for later error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeSaveForLater = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const bookId = req.params.id; // from URL

    const saveForLater = await SaveForLater.findOneAndDelete({
      user: userId,
      book: bookId,
    });
    if (!saveForLater) {
      return res.status(404).json({ message: "Save for later not found" });
    }

    await Book.findByIdAndUpdate(bookId, { $inc: { saves: -1 } });
    res.status(200).json({
      success: true,
      message: "Book removed from save for later",
      saveForLater,
    });
  } catch (error) {
    console.error("Remove save for later error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.countTotalSaves = async (req, res) => {

// };
