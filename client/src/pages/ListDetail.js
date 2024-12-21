import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Paper,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { getExpenses, deleteExpense, createExpense, updateExpense } from "../services/api";

const ListDetail = () => {
  const theme = useTheme();
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
    <Container maxWidth="100%" sx={{px: "0 !important"}}>
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          p: 4,
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <ReceiptLongIcon
            sx={{
              fontSize: 40,
              color: theme.palette.primary.main,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Expense List
          </Typography>
        </Box>

        <Box display="flex" gap={4} mb={3}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 2,
              py: 1,
              boxShadow: theme.shadows[2],
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              },
            }}
          >
            Add Expense
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDF}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3.5,
              py: 1,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            Download
          </Button>
        </Box>

        <Card
          elevation={0}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: 3,
            mb: 2
          }}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Total: Rs {parseInt(calculateTotal(), 10)}
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            mb: 4,
            background: theme.palette.background.paper,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <List>
              {expenses.map((expense, index) => (
                <Fade in key={expense._id} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
                  <ListItem
                    sx={{
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                    secondaryAction={
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Edit Expense" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEditDialog(expense)}
                            sx={{
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Expense" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDialog(expense._id)}
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1" fontWeight={500}>
                            {expense.description}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="primary"
                            fontWeight={600}
                            sx={{ ml: 2 }}
                          >
                            Rs {parseInt(expense.amount, 10)}
                          </Typography>
                        </Box>
                      }
                      secondary={new Date(expense.date).toLocaleDateString()}
                    />
                  </ListItem>
                </Fade>
              ))}
            </List>
          </CardContent>
        </Card>
      </Paper>

      {/* Add Expense Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Add New Expense
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            name="description"
            fullWidth
            variant="outlined"
            value={newExpense.description}
            onChange={handleNewExpenseChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Amount (Rs)"
            type="number"
            name="amount"
            fullWidth
            variant="outlined"
            value={newExpense.amount}
            onChange={handleNewExpenseChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            name="date"
            fullWidth
            variant="outlined"
            value={newExpense.date}
            onChange={handleNewExpenseChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={handleCloseAddDialog}
            sx={{
              color: theme.palette.text.secondary,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddExpense}
            variant="contained"
            sx={{
              px: 3,
              textTransform: "none",
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            }}
          >
            Add Expense
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: "100%",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Edit Expense
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            name="description"
            fullWidth
            variant="outlined"
            value={editedExpense.description}
            onChange={handleEditedExpenseChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Amount (Rs)"
            type="number"
            name="amount"
            fullWidth
            variant="outlined"
            value={editedExpense.amount}
            onChange={handleEditedExpenseChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            name="date"
            fullWidth
            variant="outlined"
            value={editedExpense.date}
            onChange={handleEditedExpenseChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={handleCloseEditDialog}
            sx={{
              color: theme.palette.text.secondary,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditExpense}
            variant="contained"
            sx={{
              px: 3,
              textTransform: "none",
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        content="Are you sure you want to delete this expense? This action cannot be undone."
      />
    </Container>
  );
};

export default ListDetail;
