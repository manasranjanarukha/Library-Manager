const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book", // <-- links to the Book model
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // <-- links to the User model
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
});
module.exports = mongoose.model("Rating", ratingSchema);
