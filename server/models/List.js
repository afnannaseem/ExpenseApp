// server/models/List.js

const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", ListSchema);
