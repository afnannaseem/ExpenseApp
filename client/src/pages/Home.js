// client/src/pages/Home.js

import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit"; // Ensure EditIcon is imported
import ConfirmationDialog from "../components/ConfirmationDialog";
import { ListsContext } from "../contexts/ListsContext"; // Import the context

const Home = () => {
  const { lists, handleCreateList, handleDeleteList, handleEditList } =
    useContext(ListsContext);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState(null);
  const [editedListName, setEditedListName] = useState("");

  const handleOpenDeleteDialog = (id) => {
    setListToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setListToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!listToDelete) return;
    try {
      await handleDeleteList(listToDelete);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Failed to delete list. Please try again.");
    }
  };

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setNewListName("");
  };

  const handleCreateListClick = async () => {
    if (newListName.trim() === "") {
      alert("List name cannot be empty.");
      return;
    }
    try {
      await handleCreateList(newListName);
      handleCloseAddDialog();
    } catch (error) {
      console.error("Error creating list:", error);
      alert("Failed to create list. Please try again.");
    }
  };

  const handleOpenEditDialog = (list) => {
    setListToEdit(list);
    setEditedListName(list.name);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setListToEdit(null);
    setEditedListName("");
  };

  const handleEditListClick = async () => {
    if (editedListName.trim() === "") {
      alert("List name cannot be empty.");
      return;
    }
    try {
      await handleEditList(listToEdit._id, editedListName);
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating list:", error);
      alert("Failed to update list. Please try again.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Expense Lists
      </Typography>
      <List>
        {lists.map((list) => (
          <ListItem
            key={list._id}
            secondaryAction={
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Edit List">
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenEditDialog(list)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete List">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDeleteDialog(list._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          >
            <ListItemText
              primary={
                <Link
                  to={`/list/${list._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {list.name}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenAddDialog}
        sx={{ mt: 2 }}
      >
        Add New List
      </Button>

      {/* Add List Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            type="text"
            fullWidth
            variant="standard"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleCreateListClick} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit List Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit List Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            type="text"
            fullWidth
            variant="standard"
            value={editedListName}
            onChange={(e) => setEditedListName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditListClick} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deleting List */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        content="Are you sure you want to delete this list? This action cannot be undone."
      />
    </Container>
  );
};

export default Home;
