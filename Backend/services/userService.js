const mongoose = require("mongoose");
const User = require("../models/user");
const Book = require("../models/book");
const Review = require("../models/review");
const Favorite = require("../models/favorite");

async function deleteUserWithDependencies(userId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const books = await Book.find({ author: userId }).session(session);
    const bookIds = books.map((b) => b._id);

    if (bookIds.length > 0) {
      await Review.deleteMany({ book: { $in: bookIds } }).session(session);
      await Favorite.deleteMany({ book: { $in: bookIds } }).session(session);
    }

    await Book.deleteMany({ author: userId }).session(session);

    await Review.deleteMany({ user: userId }).session(session);
    await Favorite.deleteMany({ user: userId }).session(session);

    await User.findByIdAndDelete(userId).session(session);

    await session.commitTransaction();

    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

module.exports = {
  deleteUserWithDependencies,
};