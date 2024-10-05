// server/routes/expenses.js

const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const List = require("../models/List");

// Create a new expense under a specific list
router.post("/:listId", async (req, res) => {
  try {
    const { description, amount, date } = req.body;
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const newExpense = new Expense({
      description,
      amount,
      date: date ? new Date(date) : Date.now(),
      list: list._id,
    });

    const savedExpense = await newExpense.save();

    list.expenses.push(savedExpense._id);
    await list.save();

    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all expenses for a specific list
router.get("/:listId", async (req, res) => {
  try {
    const expenses = await Expense.find({ list: req.params.listId }).sort({
      date: -1,
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single expense by ID
router.get("/expense/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an expense
router.put("/:listId/:expenseId", async (req, res) => {
  try {
    const { description, amount, date } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.expenseId,
      { description, amount, date: date ? new Date(date) : Date.now() },
      { new: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an expense
router.delete("/:listId/:expenseId", async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(
      req.params.expenseId
    );
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Remove the expense from the list's expenses array
    await List.findByIdAndUpdate(req.params.listId, {
      $pull: { expenses: req.params.expenseId },
    });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
