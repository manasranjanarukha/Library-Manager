const { check, validationResult } = require("express-validator");

const Book = require("../models/book");
const cloudinary = require("../config/cloudinaryConfig");
const cleanupUploads = require("../utils/cloudinaryCleanup");
const deleteBookWithDependencies = require("../services/bookService");
const User = require("../models/user");
const Review = require("../models/review");
exports.createBookItem = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 40 })
    .withMessage("Title must be between 2 and 40 characters"),

  // check("author").trim().notEmpty().withMessage("Author is required"),

  check("genre").trim().notEmpty().withMessage("Genre is required"),

  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  check("pages")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Pages must be a positive number"),

  check("publishedYear")
    .optional()
    .isInt({ min: 1500, max: new Date().getFullYear() })
    .withMessage("Published year must be valid"),

  async (req, res, next) => {
    const errors = validationResult(req);
    const cover = req.files?.cover?.[0];
    const bookFile = req.files?.bookFile?.[0];

    let allErrors = [];

    // 1️⃣ collect validation errors
    if (!errors.isEmpty()) {
      allErrors = [...errors.array()];
    }

    // 2️⃣ collect file errors
    if (!cover) {
      allErrors.push({ msg: "Cover is required", path: "cover" });
    }

    if (!bookFile) {
      allErrors.push({ msg: "Book file is required", path: "bookFile" });
    }

    // 3️⃣ if any error → cleanup + return
    if (allErrors.length > 0) {
      await cleanupUploads(req.files);

      return res.status(400).json({
        success: false,
        errors: allErrors,
      });
    }

    // your existing logic continues...
    const { title, genre, description, pages, publishedYear, status } =
      req.body;

    try {
      const book = new Book({
        cover: req.files?.cover?.[0]?.path || "",
        bookFile: req.files?.bookFile?.[0]?.path || "",
        title,
        author: req.params.id,
        genre,
        description,
        pages,
        publishedYear,
        status,
      });

      const savedBook = await book.save();

      return res.status(201).json({
        success: true,
        message: "Book created successfully",
        savedBook,
      });
    } catch (err) {
      console.error("Error creating book:", err.message);

      res.status(500).json({
        success: false,
        message: "Server error while creating book",
      });
    }
  },
];

exports.editBookItem = [
  // =========================
  // 🧾 VALIDATION (OPTIONAL)
  // =========================
  check("title")
    .optional()
    .isLength({ min: 2, max: 40 })
    .withMessage("Title must be between 2 and 40 characters"),

  check("genre").optional().notEmpty().withMessage("Genre cannot be empty"),

  check("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  check("pages")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Pages must be a positive number"),

  check("publishedYear")
    .optional()
    .isInt({ min: 1500, max: new Date().getFullYear() })
    .withMessage("Published year must be valid"),

  // =========================
  // 🚀 CONTROLLER
  // =========================
  async (req, res) => {
    const errors = validationResult(req);
    console.log("Validation errors:", errors.array());

    // ❌ If validation fails → cleanup uploaded files
    if (!errors.isEmpty()) {
      await cleanupUploads(req.files);

      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const bookId = req.params.id;

      const existingBook = await Book.findById(bookId);

      // ❌ If book not found → cleanup new uploads
      if (!existingBook) {
        await cleanupUploads(req.files);

        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      let coverUrl = existingBook.cover;
      let bookFileUrl = existingBook.bookFile;

      // =========================
      // 🖼️ COVER UPDATE
      // =========================
      if (req.files?.cover) {
        // delete old cover
        const oldCoverId = existingBook.cover
          ?.split("/upload/")[1]
          ?.replace(/v\d+\//, "")
          ?.replace(/\.[^/.]+$/, "");

        if (oldCoverId) {
          await cloudinary.uploader.destroy(oldCoverId);
        }

        coverUrl = req.files.cover[0].path;
      }

      // =========================
      // 📄 BOOK FILE UPDATE
      // =========================
      if (req.files?.bookFile) {
        const oldFileId = existingBook.bookFile
          ?.split("/upload/")[1]
          ?.replace(/v\d+\//, "")
          ?.replace(/\.[^/.]+$/, "");

        if (oldFileId) {
          const isRaw = existingBook.bookFile.includes("/raw/upload/");

          await cloudinary.uploader.destroy(oldFileId, {
            resource_type: isRaw ? "raw" : "image",
          });
        }

        bookFileUrl = req.files.bookFile[0].path;
      }

      // =========================
      // 🧾 UPDATE DB
      // =========================
      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        {
          ...req.body,
          cover: coverUrl,
          bookFile: bookFileUrl,
        },
        { new: true, runValidators: true },
      );

      return res.status(200).json({
        success: true,
        message: "Book updated successfully",
        book: updatedBook,
      });
    } catch (err) {
      // ❌ rollback new uploads if something fails
      await cleanupUploads(req.files);

      console.error("Error editing book:", err.message);

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
];

exports.deleteBookItem = async (req, res) => {
  const bookId = req.params.id;
  try {
    await deleteBookWithDependencies(bookId);
    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getAllBookItems = async (req, res) => {
  const userId = req.session?.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { genre } = req.query;
    const query =
      user.userType === "Author"
        ? { author: userId }
        : {
            status: "published",
          };
    if (genre) {
      query.genre = genre;
    }

    const books = await Book.find(query).populate("author", "fullName");

    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookItemById = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId).populate("author", "fullName");

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).json({ message: "Server error while fetching book" });
  }
};
