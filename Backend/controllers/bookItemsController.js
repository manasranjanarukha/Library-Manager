const { check, validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const Book = require("../models/book");

exports.createBookItem = [
  // Validation for body fields
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 40 })
    .withMessage("Title must be between 2 and 50 characters"),
  check("author").trim().notEmpty().withMessage("Author is required"),
  check("genre").trim().notEmpty().withMessage("Genre is required"),
  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a positive number"),
  check("description")
    .notEmpty()
    .withMessage("description is required")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  check("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  check("pages")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Pages must be a positive number"),
  check("publishedYear")
    .optional()
    .isInt({ min: 1500, max: new Date().getFullYear() })
    .withMessage("Published year must be valid"),

  // Controller logic
  async (req, res, next) => {
    const errors = validationResult(req);

    const {
      title,
      author,
      genre,
      price,
      description,
      rating,
      pages,
      publishedYear,
    } = req.body;

    const allErrors = [];
    if (!errors.isEmpty()) {
      await cleanupUploadedFiles(req);
      allErrors.push(...errors.array());
    }
    try {
      if (allErrors.length > 0) {
        return res.status(422).json({ success: false, errors: allErrors });
      } else {
      }
      // 2️⃣ Check for required files
      if (!req.files?.cover || !req.files?.bookFile) {
        await cleanupUploadedFiles(req);
        return res.status(400).json({
          success: false,
          message: "Both cover and bookFile are required.",
        });
      }
      const book = new Book({
        cover: req.files?.cover ? req.files?.cover[0]?.filename : null,
        bookFile: req.files?.bookFile ? req.files?.bookFile[0]?.filename : null,
        title,
        author,
        genre,
        price,
        description,
        rating,
        pages,
        publishedYear,
      });
      const savedBook = await book.save();
      res.status(201).json({
        success: true,
        message: "Book created successfully",
        savedBook,
      });
    } catch (err) {
      await cleanupUploadedFiles(req);
      next(err);
    }
    // 🧹 Helper function for cleaning up uploaded files
    async function cleanupUploadedFiles(req) {
      if (req.files?.cover) {
        for (const file of req.files.cover) {
          fs.unlink(path.join("uploads/books/covers", file.filename), () => {});
        }
      }
      if (req.files?.bookFile) {
        for (const file of req.files.bookFile) {
          fs.unlink(
            path.join("uploads/books/bookFiles", file.filename),
            () => {},
          );
        }
      }
    }
  },
];

exports.editBookItem = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    // 1. Fetch existing book
    const existingBook = await Book.findById(bookId);

    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // 2. If new file uploaded, compute old image path

    console.log("existingBook.cover:", existingBook.cover);
    if (req.files?.cover) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "books",
        "covers",
        existingBook.cover,
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Error deleting old cover:", err);
      });
    }

    if (req.files?.bookFile) {
      const oldPdfPath = path.join(
        __dirname,
        "..",
        "uploads",
        "books",
        "bookFiles",
        existingBook.bookFile,
      );
      fs.unlink(oldPdfPath, (err) => {
        if (err) console.error("Error deleting old PDF:", err);
      });
    }

    // 3. Build updates (keep old cover if no new file)
    const updates = {
      ...req.body,
      cover: req.files?.cover?.[0]?.filename || existingBook.cover,
      bookFile: req.files?.bookFile?.[0]?.filename || existingBook.bookFile,
    };

    // 4. Apply update
    const book = await Book.findByIdAndUpdate(bookId, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ success: true, book });
  } catch (err) {
    console.error("Error editing book:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBookItem = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    // 1. Find the book
    const deletingBookCovers = await Book.findById(bookId);
    const deletingBookFiles = await Book.findById(bookId);
    console.log("Deletong book", deletingBookFiles.bookFile);

    if (!deletingBookCovers && !deletingBookFiles) {
      return res.status(404).json({ message: "Book not found" });
    }

    // 2. Remove cover image from uploads if exists
    if (deletingBookCovers.cover && deletingBookFiles.bookFile) {
      const coverPath = path.join(
        __dirname,
        "..",
        "uploads",
        "books",
        "covers",
        deletingBookCovers.cover,
      );
      const bookFilePath = path.join(
        __dirname,
        "..",
        "uploads",
        "books",
        "bookFiles",
        deletingBookFiles.bookFile,
      );
      fs.unlink(coverPath, (err) => {
        if (err) {
          console.error("Failed to delete cover image:", err.message);
        } else {
          console.log("Cover image deleted:", coverPath);
        }
      });
      fs.unlink(bookFilePath, (err) => {
        if (err) {
          console.error("Failed to delete book file:", err.message);
        } else {
          console.log("Book file deleted:", bookFilePath);
        }
      });
    }

    // 3. Delete the book from DB
    await Book.findByIdAndDelete(bookId);

    // 4. Respond to client
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getAllBookItems = async (req, res, next) => {
  await Book.find()
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Fetching book items failed", error: err });
    });
};

exports.getBookItemById = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).json({ message: "Server error while fetching book" });
  }
};

exports.getFavoriteBooks = async (req, res) => {
  const bookId = req.params.id;
  console.log(bookId, "bookid");
  const favBook = await Book.findById(bookId);

  res.status(200).json({
    success: true,
    bookId,
    favBook,
  });
};
