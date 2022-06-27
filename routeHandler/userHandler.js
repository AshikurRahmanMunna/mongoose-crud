const express = require("express");
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = new mongoose.model("User", userSchema);

// get all todos
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ success: true, message: "Signed Up Successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Signup Failed", error: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      if (isValidPassword) {
        const token = jwt.sign(
          {
            username: user[0].name,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res
          .status(200)
          .json({ success: true, token, message: "Log In Successful" });
      } else {
        res.status(401).json({
          error: "Authentication Failed!",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication Failed!",
      });
    }
  } catch (err) {
    res.status(401).json({
      error: "Authentication Failed!",
    });
  }
});

module.exports = router;
