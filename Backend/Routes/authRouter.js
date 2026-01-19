const express = require("express");
const authRouter = express.Router();
const upload = require("../middlewares/upload");

const authController = require("../controllers/authController");

authRouter.post(
  "/register",
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  authController.register
);
authRouter.post("/login", authController.Login);
authRouter.get("/me", authController.whoAmI);
authRouter.post("/logout", authController.logout);
authRouter.put("/user/:id", authController.updateUser);

module.exports = authRouter;
