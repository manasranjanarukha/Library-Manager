const { check, validationResult } = require("express-validator");

const Book = require("../models/book");
const cloudinary = require("../config/cloudinaryConfig");
const cleanupUploads = require("../utils/cloudinaryCleanup");
exports.createBookItem = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 40 })
    .withMessage("Title must be between 2 and 40 characters"),

  check("author").trim().notEmpty().withMessage("Author is required"),

  check("genre").trim().notEmpty().withMessage("Genre is required"),

  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a positive number"),

  check("description")
    .notEmpty()
    .withMessage("Description is required")
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
    try {
      console.log("✅ STEP 4: All checks passed. Saving to Database...");
      const book = new Book({
        cover: req.files?.cover?.[0]?.path || "",
        bookFile: req.files?.bookFile?.[0]?.path || "",
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
      console.log("🎉 STEP 5: Success response sent to user!");
      return res.status(201).json({
        success: true,
        message: "Book created successfully",
        savedBook,
      });
    } catch (err) {
      console.error("Error creating book:", err.message);
      console.log("🔥 FULL ERROR OBJECT:", err);
      console.log("🔥 ERROR SOURCE:", err.name);
      console.log("🔥 ERROR MESSAGE:", err.message);
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

  check("author")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Author cannot be empty"),
  check("genre").optional().notEmpty().withMessage("Genre cannot be empty"),

  check("price").optional().isNumeric().withMessage("Price must be a number"),

  check("description")
    .optional()
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

  // =========================
  // 🚀 CONTROLLER
  // =========================
  async (req, res) => {
    const errors = validationResult(req);

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
          console.log("🧹 Deleted old cover");
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

          console.log("🧹 Deleted old book file");
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
  try {
    const bookId = req.params.id;
    console.log("book id", bookId);

    // =========================
    // 🔍 Find Book
    // =========================
    const existingBook = await Book.findById(bookId);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // same extraction pattern used elsewhere
    const extractPublicId = (url) => {
      if (!url) return null;

      try {
        return url
          .split("/upload/")[1]
          .replace(/^v\d+\//, "") // removes v1777057005/
          .replace(/\.[^/.]+$/, "");
      } catch {
        return null;
      }
    };

    // =========================
    // 🖼️ DELETE COVER
    // =========================
    if (existingBook.cover) {
      try {
        const coverId = extractPublicId(existingBook.cover);
        console.log("cover id", coverId);

        if (coverId) {
          const cover = await cloudinary.uploader.destroy(coverId, {
            resource_type: "image",
          });
          console.log("cover", cover);

          console.log("🧹 Deleted cover");
        }
      } catch (err) {
        console.error("Cover deletion failed:", err.message);
      }
    }

    // =========================
    // 📄 DELETE BOOK FILE
    // =========================
    if (existingBook.bookFile) {
      try {
        const fileId = extractPublicId(existingBook.bookFile);
        console.log("fileID", fileId);

        const isRaw = existingBook.bookFile.includes("/raw/upload/");

        if (fileId) {
          const book = await cloudinary.uploader.destroy(fileId, {
            resource_type: isRaw ? "raw" : "image",
          });
          console.log("book", book);
          console.log("🧹 Deleted book file");
        }
      } catch (err) {
        console.error("Book file deletion failed:", err.message);
      }
    }

    // =========================
    // 🗑️ DELETE DB RECORD
    // =========================
    await Book.findByIdAndDelete(bookId);

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (err) {
    console.error("Delete book error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting book",
    });
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
