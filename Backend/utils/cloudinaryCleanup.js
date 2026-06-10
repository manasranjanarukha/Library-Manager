const cloudinary = require("../config/cloudinaryConfig");

const cleanupUploads = async (files) => {
  if (!files) return;

  const extractPublicId = (url) => {
    try {
      const parts = url.split("/upload/");

      if (parts.length < 2) return null;

      let path = parts[1];

      // remove transformations + version
      // path = path.replace(/^.*\/v\d+\//, "");
      path = path.replace(/^v\d+\//, "");

      // remove extension safely
      return path.replace(/\.[^/.]+$/, "");
    } catch {
      return null;
    }
  };
  console.log("Starting cleanup for files:", {
    cover: files.cover?.[0]?.path,
    bookFile: files.bookFile?.[0]?.path,
    profilePicture: files.profilePicture?.[0]?.path,
  });
  try {
    if (files.cover?.[0]) {
      const id = extractPublicId(files.cover[0].path);
      console.log("Extracted cover ID:", id);
      if (id) {
        const result1 = await cloudinary.uploader.destroy(id);
        console.log("Cover cleanup result:", result1);
      }
    }

    if (files.bookFile?.[0]) {
      const id = extractPublicId(files.bookFile[0].path);

      const isRaw = files.bookFile[0].path.includes("/raw/upload/");
      console.log("Is raw file:", isRaw);
      console.log("Extracted book file ID:", id);
      if (id) {
        const result2 = await cloudinary.uploader.destroy(id, {
          resource_type: isRaw ? "raw" : "auto",
        });
        console.log("Book file cleanup result:", result2);
      }
    }
    if (files.profilePicture?.[0]) {
      const id = extractPublicId(files.profilePicture[0].path);

      if (id) {
        const result3 = await cloudinary.uploader.destroy(id);
        console.log("Profile picture cleanup result:", result3);
      }
    }
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
};

module.exports = cleanupUploads;
