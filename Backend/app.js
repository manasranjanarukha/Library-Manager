//Core Module
const path = require("path");
// External Module

const express = require("express");
const session = require("express-session");
require("dotenv").config();

const dbUrl = process.env.MONGO_URL;
const mongoDbStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();

// Local Module
const rootDir = require("./utils/pathUtil");
const bookItemsRouter = require("./Routes/bookItemsRouter");
const authRouter = require("./Routes/authRouter");
const reviewItemsRouter = require("./Routes/reviewRouter");

// Session Store
const store = new mongoDbStore({
  uri: dbUrl,
  collection: "sessions",
});
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);

app.use("/book-items", bookItemsRouter);
app.use("/auth", authRouter);
app.use("/reviews", reviewItemsRouter);

const port = process.env.PORT;

mongoose
  .connect(dbUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on address http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB using Mongoose:", err.message);
  });
