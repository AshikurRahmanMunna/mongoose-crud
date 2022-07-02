const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require('./routeHandler/userHandler');

// express init
const app = express();
require("dotenv").config();
app.use(express.json());

// database connection with mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.44qduad.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected Successfully"))
  .catch((err) => console.log(err));

// application routes
app.use("/todo", todoHandler);
app.use('/user', userHandler)

// database connection with mongoose
const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}
app.use(errorHandler);
app.listen(3000, () => {
  console.log("Mongoose App listening on port 3000");
});
