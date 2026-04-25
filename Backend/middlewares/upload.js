const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// Import your Cloudinary config file from the previous step!
// Adjust this path based on where your files are located.
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = "";
    let resourceType = "auto"; // Default to 'auto' to handle both images and non-images
    console.log("cloudinary Req", file);

    // Replicating your routing logic for Cloudinary folders
    if (file.fieldname === "cover") {
      folderName = "books/covers";
      resourceType = "image"; // Covers are always images
    } else if (file.fieldname === "bookFile") {
      folderName = "books/bookFiles";
      resourceType = "raw"; // Book files can be PDFs, EPUBs, etc.
    } else if (file.fieldname === "profilePicture") {
      folderName = "users/profilePictures";
      resourceType = "image"; // Profile pictures are always images
    } else {
      throw new Error("Invalid field name");
      ``;
    }

    return {
      folder: folderName,
      // IMPORTANT: 'auto' is required if 'bookFile' is a PDF, EPUB, or other non-image format.
      // Cloudinary defaults to images only unless you specify this.
      resource_type: resourceType,
      // Cloudinary handles extensions automatically, so we strip it off the original name
      public_id: Date.now().toString(), // You can customize this to use a more meaningful naming convention
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
});

module.exports = upload;
