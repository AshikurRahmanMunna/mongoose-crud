const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const todoHandler = require("./routeHandler/todoHandler");

// express init
const app = express();
app.use(express.json());

// database connection with mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.44qduad.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connection Successfully"))
  .catch((err) => console.log(err));

// application routes
app.use("/todo", todoHandler);

// database connection with mongoose
function errorHandler(err, req, res, next) {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(3000, () => {
  console.log("Mongoose App listening on port 3000");
});