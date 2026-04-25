const cloudinary = require("../config/cloudinaryConfig");

const cleanupUploads = async (files) => {
  if (!files) return;

  const extractPublicId = (url) => {
    try {
      const parts = url.split("/upload/");
      if (parts.length < 2) return null;

      let path = parts[1];

      // remove transformations + version
      path = path.replace(/^.*\/v\d+\//, "");

      // remove extension safely
      return path.replace(/\.[^/.]+$/, "");
    } catch {
      return null;
    }
  };

  try {
    if (files.cover?.[0]) {
      const id = extractPublicId(files.cover[0].path);
      if (id) {
        await cloudinary.uploader.destroy(id);

        console.log("🧹 cover cleaned");
      }
    }

    if (files.bookFile?.[0]) {
      const id = extractPublicId(files.bookFile[0].path);

      const isRaw = files.bookFile[0].path.includes("/raw/upload/");

      if (id) {
        await cloudinary.uploader.destroy(id, {
          resource_type: isRaw ? "raw" : "auto",
        });
      }

      console.log("🧹 bookFile cleaned");
    }
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
};

module.exports = cleanupUploads;
