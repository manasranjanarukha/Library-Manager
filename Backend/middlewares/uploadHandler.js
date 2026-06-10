const upload = require("./upload");
const cloudinary = require("../config/cloudinaryConfig");
const cleanupUploads = require("../utils/cloudinaryCleanup");

// 🔧 Helper: extract public_id from Cloudinary URL
const extractPublicId = (url) => {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let path = parts[1];

    // remove transformations + version
    path = path.replace(/^.*\/v\d+\//, "");

    // remove only last extension
    return path.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

const uploadFields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "bookFile", maxCount: 1 },
]);

const handleUpload = (req, res, next) => {
  uploadFields(req, res, async function (err) {
    if (err) {
      console.log(req.files);
      await cleanupUploads(req.files);
      console.error("Multer Error:", {
        message: err.message,
        code: err.code,
      });

      // 🔥 CLEANUP: cover
      if (req.files?.cover?.[0]) {
        try {
          const coverUrl = req.files.cover[0].path;
          const publicId = extractPublicId(coverUrl);

          if (publicId) {
            const coverUp = await cloudinary.uploader.destroy(publicId, {
              resource_type: "image",
            });
          }
        } catch (cleanupErr) {
          console.error("Cover cleanup failed:", cleanupErr.message);
        }
      }

      // 🔥 CLEANUP: bookFile
      if (req.files?.bookFile?.[0]) {
        try {
          const fileUrl = req.files.bookFile[0].path;
          const publicId = extractPublicId(fileUrl);

          const isRaw = fileUrl.includes("/raw/upload/");

          if (publicId) {
            const bookFileUp = await cloudinary.uploader.destroy(publicId, {
              resource_type: isRaw ? "raw" : "image",
            });
          }
        } catch (cleanupErr) {
          console.error("Book cleanup failed:", cleanupErr.message);
        }
      }

      // 🔥 SEND ERROR RESPONSE
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 10MB limit",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};

module.exports = handleUpload;
