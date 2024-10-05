// server/routes/lists.js

const express = require("express");
const router = express.Router();
const List = require("../models/List");
const Expense = require("../models/Expense");

// Create a new list
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newList = new List({ name, expenses: [] });
    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all lists
router.get("/", async (req, res) => {
  try {
    const lists = await List.find().populate("expenses");
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a list's name
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updatedList = await List.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedList) {
      return res.status(404).json({ message: "List not found" });
    }
    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a list and its associated expenses
router.delete("/:id", async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Delete all expenses associated with the list
    await Expense.deleteMany({ list: list._id });

    // Delete the list
    await List.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "List and associated expenses deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
