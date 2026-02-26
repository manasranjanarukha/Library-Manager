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
favItemsRouter.get("/stars", isAuthenticated, favItemController.fetchFavorites);
favItemsRouter.delete(
  "/star/:id",
  isAuthenticated,
  favItemController.removeFavorite,
);

module.exports = favItemsRouter;
