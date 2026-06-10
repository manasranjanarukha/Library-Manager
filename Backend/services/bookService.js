const mongoose = require("mongoose");
const User = require("../models/user");
const Book = require("../models/book");
const Review = require("../models/review");
const SaveForLater = require("../models/saveForLater");
const cloudinary = require("../config/cloudinaryConfig");
const extractPublicId = require("../services/userService").extractPublicId;

async function deleteBookWithDependencies(bookId) {
  const session = await mongoose.startSession();
  try {
    console.log("Deleting book and dependencies for bookId:", bookId);
    const book = await Book.findById(bookId);

    if (!book) {
      console.log("Book not found for id:", bookId);
      return;
    }
    // delete book cover and file from Cloudinary
    const coverId = extractPublicId(book?.cover);
    const fileId = extractPublicId(book?.bookFile);
    console.log("Extracted coverId:", coverId, "fileId:", fileId);
    const cloudinaryDeletes = [];
    if (coverId) {
      cloudinaryDeletes.push(
        cloudinary.uploader.destroy(coverId, { resource_type: "image" }),
      );
    }
    if (fileId) {
      cloudinaryDeletes.push(
        cloudinary.uploader.destroy(fileId, { resource_type: "raw" }),
      );
    }
    await Promise.all(cloudinaryDeletes);
    // start DB transaction
    session.startTransaction();
    await Book.findByIdAndDelete(bookId).session(session);
    await Review.deleteMany({ book: bookId }).session(session);
    await SaveForLater.deleteMany({ book: bookId }).session(session);
    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    console.error("Error deleting book and dependencies:", error);
    await session.abortTransaction();
    return { success: false, error: error.message };
  } finally {
    session.endSession();
  }
}

module.exports = deleteBookWithDependencies;
