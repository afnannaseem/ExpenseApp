// client/src/pages/ListDetail.js

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getExpenses,
  deleteExpense,
  createExpense,
  updateExpense,
} from "../services/api";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  TextField,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ConfirmationDialog from "../components/ConfirmationDialog";

const ListDetail = () => {
  const { id } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [filterDates, setFilterDates] = useState({ from: "", to: "" });

  // State for Delete Confirmation Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // State for Add Expense Dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: "",
  });

  // State for Edit Expense Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [editedExpense, setEditedExpense] = useState({
    description: "",
    amount: "",
    date: "",
  });

  // Fetch expenses when component mounts or when list ID changes
  const fetchExpenses = async () => {
    try {
      const response = await getExpenses(id);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [id]);

  // Handle Delete Expense
  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteExpense(id, expenseId);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Calculate total expenses
  const calculateTotal = () => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    let filteredExpenses = expenses;

    if (filterDates.from) {
      filteredExpenses = filteredExpenses.filter(
        (expense) => new Date(expense.date) >= new Date(filterDates.from)
      );
    }

    if (filterDates.to) {
      filteredExpenses = filteredExpenses.filter(
        (expense) => new Date(expense.date) <= new Date(filterDates.to)
      );
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("House Expense", 14, 20);
    doc.setFontSize(12);

    // Normal text "You have to send a total of PKR "
    const text1 = "You have to send a total of PKR ";
    const totalAmount = `${calculateTotal()}`;
    const text2 = " to my account.";

    // Measure the width of the text1
    const text1Width = doc.getTextWidth(text1);

    // Draw the first part of the sentence
    doc.text(text1, 14, 30);

    // Set font to bold for the total amount
    doc.setFont("helvetica", "bold");
    doc.text(totalAmount, 15 + text1Width, 30); // Position the amount dynamically

    // Reset font to normal after the total amount
    doc.setFont("helvetica", "normal");
    const totalAmountWidth = doc.getTextWidth(totalAmount);
    doc.text(text2, 15 + text1Width + totalAmountWidth, 30); // Position the remaining text dynamically

    const tableColumn = ["Description", "Date", "Amount"];
    const tableRows = [];

    filteredExpenses.forEach((expense) => {
      const expenseData = [
        expense.description,
        new Date(expense.date).toLocaleDateString(),
        `Rs ${parseInt(expense.amount, 10)}`,
      ];
      tableRows.push(expenseData);
    });

    // Add Total row
    tableRows.push([
      { content: "", styles: { fontStyle: "normal" } }, // Empty cell, normal text
      { content: "Total", styles: { fontStyle: "bold" } }, // Bold "Total"
      {
        content: `Rs ${parseInt(calculateTotal(), 10)}`,
        styles: { fontStyle: "bold" },
      }, // Bold total amount
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { halign: "left" },
      headStyles: { fillColor: [22, 160, 133] },
    });
    doc.save("House_Expense.pdf");
  };

  // Handle Date Range Change
  const handleDateChange = (e) => {
    setFilterDates({ ...filterDates, [e.target.name]: e.target.value });
  };

  // Open Delete Confirmation Dialog
  const handleOpenDeleteDialog = (expenseId) => {
    setExpenseToDelete(expenseId);
    setDeleteDialogOpen(true);
  };

  // Close Delete Confirmation Dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  // Confirm Deletion of Expense
  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await deleteExpense(id, expenseToDelete);
      fetchExpenses();
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Open Add Expense Dialog
  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  // Close Add Expense Dialog
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setNewExpense({ description: "", amount: "", date: "" });
  };

  // Handle Change in New Expense Fields
  const handleNewExpenseChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  // Handle Adding a New Expense
  const handleAddExpense = async () => {
    const { description, amount, date } = newExpense;
    if (!description || !amount) {
      alert("Please provide both description and amount.");
      return;
    }
    try {
      await createExpense(id, { description, amount: Number(amount), date });
      fetchExpenses();
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("Failed to create expense. Please try again.");
    }
  };

  // Open Edit Expense Dialog
  const handleOpenEditDialog = (expense) => {
    setExpenseToEdit(expense);
    setEditedExpense({
      description: expense.description,
      amount: expense.amount,
      date: expense.date ? expense.date.substring(0, 10) : "",
    });
    setEditDialogOpen(true);
  };

  // Close Edit Expense Dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setExpenseToEdit(null);
    setEditedExpense({ description: "", amount: "", date: "" });
  };

  // Handle Editing an Expense
  const handleEditExpense = async () => {
    const { description, amount, date } = editedExpense;
    if (!description || !amount) {
      alert("Please provide both description and amount.");
      return;
    }
    try {
      await updateExpense(id, expenseToEdit._id, {
        description,
        amount: Number(amount),
        date,
      });
      fetchExpenses();
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense. Please try again.");
    }
  };

  // Handle Change in Edited Expense Fields
  const handleEditedExpenseChange = (e) => {
    setEditedExpense({ ...editedExpense, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Expense List
      </Typography>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Expense
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownloadPDF}
        >
          Download PDF
        </Button>
      </Box>
      <List>
        {expenses.map((expense) => (
          <ListItem
            key={expense._id}
            secondaryAction={
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Edit Expense">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenEditDialog(expense)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Expense">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDeleteDialog(expense._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          >
            <ListItemText
              primary={`${expense.description} - Rs ${parseInt(
                expense.amount,
                10
              )}`}
              secondary={new Date(expense.date).toLocaleDateString()}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography variant="h6">
        Total: Rs {parseInt(calculateTotal(), 10)}
      </Typography>

      {/* Confirmation Dialog for Deleting Expense */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        content="Are you sure you want to delete this expense? This action cannot be undone."
      />

      {/* Add Expense Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            name="description"
            fullWidth
            variant="standard"
            value={newExpense.description}
            onChange={handleNewExpenseChange}
          />
          <TextField
            margin="dense"
            label="Amount (Rs)"
            type="number"
            name="amount"
            fullWidth
            variant="standard"
            value={newExpense.amount}
            onChange={handleNewExpenseChange}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            name="date"
            fullWidth
            variant="standard"
            value={newExpense.date}
            onChange={handleNewExpenseChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddExpense} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            name="description"
            fullWidth
            variant="standard"
            value={editedExpense.description}
            onChange={handleEditedExpenseChange}
          />
          <TextField
            margin="dense"
            label="Amount (Rs)"
            type="number"
            name="amount"
            fullWidth
            variant="standard"
            value={editedExpense.amount}
            onChange={handleEditedExpenseChange}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            name="date"
            fullWidth
            variant="standard"
            value={editedExpense.date}
            onChange={handleEditedExpenseChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditExpense} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListDetail;
