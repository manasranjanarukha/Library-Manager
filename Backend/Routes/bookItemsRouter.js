const express = require("express");
const bookItemsRouter = express.Router();
const upload = require("../middlewares/upload");
const isAuthenticated = require("../middlewares/auth");
const handleUpload = require("../middlewares/uploadHandler");

const bookItemsController = require("../controllers/bookItemsController");

bookItemsRouter.post(
  "/:id",
  // isAuthenticated,
  handleUpload,

  bookItemsController.createBookItem,
);

bookItemsRouter.get("/", bookItemsController.getAllBookItems);
bookItemsRouter.get(
  "/:id",

  bookItemsController.getBookItemById,
);
bookItemsRouter.put(
  "/:id",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  bookItemsController.editBookItem,
);

bookItemsRouter.delete("/:id", bookItemsController.deleteBookItem);

module.exports = bookItemsRouter;
