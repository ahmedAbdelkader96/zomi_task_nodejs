require('dotenv').config(); 

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const passport = require('passport');
const session = require('express-session');
const connectDB = require("./configs/db");
const app = express();
require('./configs/passport');

const userRouter = require('./routes/user');
const productsRouter = require("./routes/products");
const blogsRouter = require('./routes/blogs');


// Connect to the database
connectDB();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;


app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/user", userRouter);
app.use("/products", productsRouter);
app.use("/blogs", blogsRouter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// Error handling for 404
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// General error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Start the server only if not in serverless environment
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;