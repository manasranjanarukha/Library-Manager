const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("File", file);
    if (file.fieldname === "cover") {
      cb(null, "uploads/books/covers"); // folder where files will be stored
    } else if (file.fieldname === "bookFile") {
      cb(null, "uploads/books/bookFiles"); // folder where files will be stored
    } else if (file.fieldname === "profilePicture") {
      cb(null, "uploads/users/profilePictures"); // folder where files will be stored
    } else {
      cb(new Error("Invalid field name"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
