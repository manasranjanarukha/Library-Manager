const express = require("express");
const favItemsRouter = express.Router();
const upload = require("../middlewares/upload");
const isAuthenticated = require("../middlewares/auth");
const favItemController = require("../controllers/favoriteController");
favItemsRouter.post(
  "/star/:id",
  isAuthenticated,
  favItemController.addFavorite,
);

module.exports = favItemsRouter;
