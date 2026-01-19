const express = require("express");
const reviewItemsRouter = express.Router();
const reviewItemsController = require("../controllers/reviewController");

reviewItemsRouter.post("/", reviewItemsController.createReview);
reviewItemsRouter.get("/:id", reviewItemsController.getAllReviews);
// reviewItemsRouter.get("/:id", reviewItemsController.getReviewById);
// reviewItemsRouter.put("/:id", reviewItemsController.editReview);
// reviewItemsRouter.delete("/:id", reviewItemsController.deleteReview);

module.exports = reviewItemsRouter;
// The other routes are commented out for future implementation
