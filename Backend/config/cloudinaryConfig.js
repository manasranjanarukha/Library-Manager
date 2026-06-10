// 1. Load the .env variables into process.env
require("dotenv").config();

// 2. Import cloudinary
const cloudinary = require("cloudinary").v2;

// 3. Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Test the configuration

module.exports = cloudinary;
