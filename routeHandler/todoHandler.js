const express = require("express");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");
const mongoose = require("mongoose");
const Todo = new mongoose.model("Todo", todoSchema);

// get all todos
router.get("/", (req, res) => {
  Todo.find({})
    .select({
      _id: 0,
    })
    .limit(2)
    .exec((err, data) => {
      if (err) {
        res.status(500).json({ error: "Server Side error" });
      } else {
        res.status(200).json({ success: true, data });
      }
    });
});

// get active todos
router.get("/active", async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
    data,
  });
});

// get active todos with callback
router.get("/active-callback", (req, res) => {
  const todo = new Todo();
  todo.findActiveCallback((err, data) => {
    if (err) {
      res.status(500).json({ error: "Server Side Error" });
    } else {
      res.status(200).json({ success: true, data });
    }
  });
});

router.get("/js", async (req, res) => {
  const data = await Todo.findByJs();
  res.status(200).json({ data: data });
});

// get a todo by id
router.get("/:id", async (req, res) => {
  // Todo.find({ _id: req.params.id }).exec((err, data) => {
  //   if (err) {
  //     res.status(500).json({ error: "Server Side error" });
  //   } else {
  //     res.status(200).json({ success: true, data });
  //   }
  // });

  try {
    const data = await Todo.find({ _id: req.params.id });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
});

// post a todo
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err, data) => {
    if (err) {
      res.status(500).json({ error: "There was a error in the server" });
    } else {
      res.status(200).json({ message: "ToDo was inserted successfully", data });
    }
  });
});

// post multiple todo
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "ToDos were Added successfully" });
    }
  });
});

// put todo
router.put("/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      Message: "ToDo added successfully",
      updatedDoc: result,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }

  //   await Todo.findByIdAndUpdate(
  //     { _id: req.params.id },
  //     {
  //       $set: req.body,
  //     },
  //     {
  //       new: true,
  //     }
  //   ).exec((err, data) => {
  //     if(err) {
  //         res.status(500).json({err: err});
  //     }
  //     else {
  //         res.status(200).json({success: true, data: data})
  //     }
  //   })
});

// delete todo
router.delete("/:id", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id }).exec((err, data) => {
    if (err) {
      res.status(500).json({ error: "Server Side error" });
    } else {
      res.status(200).json({ success: true, data });
    }
  });
});

module.exports = router;
