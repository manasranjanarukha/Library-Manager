const mongoose = require("mongoose");
const User = require("../models/user");
const Book = require("../models/book");
const Review = require("../models/review");
const SaveForLater = require("../models/saveForLater");
const cloudinary = require("../config/cloudinaryConfig");

//
function extractPublicId(url) {
  if (!url) return null;

  return url
    .split("/upload/")[1]
    ?.replace(/^v\d+\//, "")
    ?.replace(/\.[^/.]+$/, "");
}

async function deleteUserWithDependencies(userId) {
  const session = await mongoose.startSession();

  try {
    // 🔹 STEP 1: Fetch data BEFORE transaction
    const user = await User.findById(userId);
    const books = await Book.find({ author: userId });

    // 🔹 STEP 2: Delete Cloudinary assets (NO TRANSACTION)
    const cloudinaryDeletes = [];

    // delete user profile pic
    const profileId = extractPublicId(user?.profilePicture);
    if (profileId) {
      cloudinaryDeletes.push(
        cloudinary.uploader.destroy(profileId, { resource_type: "image" }),
      );
    }

    // delete books assets
    for (const book of books) {
      const coverId = extractPublicId(book.cover);
      const fileId = extractPublicId(book.bookFile);

      if (coverId) {
        cloudinaryDeletes.push(
          cloudinary.uploader.destroy(coverId, {
            resource_type: "image",
          }),
        );
      }

      if (fileId) {
        cloudinaryDeletes.push(
          cloudinary.uploader.destroy(fileId, {
            resource_type: "raw", // PDFs
          }),
        );
      }
    }

    await Promise.all(cloudinaryDeletes);

    // 🔹 STEP 3: Start DB transaction
    session.startTransaction();

    const bookIds = books.map((b) => b._id);

    if (bookIds.length > 0) {
      await Review.deleteMany({ book: { $in: bookIds } }).session(session);
      await SaveForLater.deleteMany({ book: { $in: bookIds } }).session(
        session,
      );
    }

    await Book.deleteMany({ author: userId }).session(session);

    await Review.deleteMany({ user: userId }).session(session);
    await SaveForLater.deleteMany({ user: userId }).session(session);

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
  extractPublicId,
};
