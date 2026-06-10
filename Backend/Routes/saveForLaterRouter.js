const express = require("express");
const saveForLaterRouter = express.Router();
const upload = require("../middlewares/upload");
const isAuthenticated = require("../middlewares/auth");
const saveForLaterController = require("../controllers/saveForLaterController");
saveForLaterRouter.post(
  "/:id",
  isAuthenticated,
  saveForLaterController.addSaveForLater,
);
saveForLaterRouter.get(
  "/",
  isAuthenticated,
  saveForLaterController.fetchSaveForLater,
);
saveForLaterRouter.delete(
  "/:id",
  isAuthenticated,
  saveForLaterController.removeSaveForLater,
);

module.exports = saveForLaterRouter;
