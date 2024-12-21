// // client/src/pages/Home.js

// import React, { useContext, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Box,
//   Tooltip,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit"; // Ensure EditIcon is imported
// import ConfirmationDialog from "../components/ConfirmationDialog";
// import { ListsContext } from "../contexts/ListsContext"; // Import the context

// const Home = () => {
//   const { lists, handleCreateList, handleDeleteList, handleEditList } =
//     useContext(ListsContext);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [listToDelete, setListToDelete] = useState(null);
//   const [addDialogOpen, setAddDialogOpen] = useState(false);
//   const [newListName, setNewListName] = useState("");
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [listToEdit, setListToEdit] = useState(null);
//   const [editedListName, setEditedListName] = useState("");

//   const handleOpenDeleteDialog = (id) => {
//     setListToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const handleCloseDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//     setListToDelete(null);
//   };

//   const handleConfirmDelete = async () => {
//     if (!listToDelete) return;
//     try {
//       await handleDeleteList(listToDelete);
//       handleCloseDeleteDialog();
//     } catch (error) {
//       console.error("Error deleting list:", error);
//       alert("Failed to delete list. Please try again.");
//     }
//   };

//   const handleOpenAddDialog = () => {
//     setAddDialogOpen(true);
//   };

//   const handleCloseAddDialog = () => {
//     setAddDialogOpen(false);
//     setNewListName("");
//   };

//   const handleCreateListClick = async () => {
//     if (newListName.trim() === "") {
//       alert("List name cannot be empty.");
//       return;
//     }
//     try {
//       await handleCreateList(newListName);
//       handleCloseAddDialog();
//     } catch (error) {
//       console.error("Error creating list:", error);
//       alert("Failed to create list. Please try again.");
//     }
//   };

//   const handleOpenEditDialog = (list) => {
//     setListToEdit(list);
//     setEditedListName(list.name);
//     setEditDialogOpen(true);
//   };

//   const handleCloseEditDialog = () => {
//     setEditDialogOpen(false);
//     setListToEdit(null);
//     setEditedListName("");
//   };

//   const handleEditListClick = async () => {
//     if (editedListName.trim() === "") {
//       alert("List name cannot be empty.");
//       return;
//     }
//     try {
//       await handleEditList(listToEdit._id, editedListName);
//       handleCloseEditDialog();
//     } catch (error) {
//       console.error("Error updating list:", error);
//       alert("Failed to update list. Please try again.");
//     }
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>
//         Expense Lists
//       </Typography>
//       <List>
//         {lists.map((list) => (
//           <ListItem
//             key={list._id}
//             secondaryAction={
//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <Tooltip title="Edit List">
//                   <IconButton
//                     edge="end"
//                     aria-label="edit"
//                     onClick={() => handleOpenEditDialog(list)}
//                   >
//                     <EditIcon />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Delete List">
//                   <IconButton
//                     edge="end"
//                     aria-label="delete"
//                     onClick={() => handleOpenDeleteDialog(list._id)}
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             }
//           >
//             <ListItemText
//               primary={
//                 <Link
//                   to={`/list/${list._id}`}
//                   style={{ textDecoration: "none", color: "inherit" }}
//                 >
//                   {list.name}
//                 </Link>
//               }
//             />
//           </ListItem>
//         ))}
//       </List>
//       <Button
//         variant="contained"
//         startIcon={<AddIcon />}
//         onClick={handleOpenAddDialog}
//         sx={{ mt: 2 }}
//       >
//         Add New List
//       </Button>

//       {/* Add List Dialog */}
//       <Dialog open={addDialogOpen} onClose={handleCloseAddDialog}>
//         <DialogTitle>Add New List</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="List Name"
//             type="text"
//             fullWidth
//             variant="standard"
//             value={newListName}
//             onChange={(e) => setNewListName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseAddDialog}>Cancel</Button>
//           <Button onClick={handleCreateListClick} variant="contained">
//             Add
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit List Dialog */}
//       <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
//         <DialogTitle>Edit List Name</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="List Name"
//             type="text"
//             fullWidth
//             variant="standard"
//             value={editedListName}
//             onChange={(e) => setEditedListName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseEditDialog}>Cancel</Button>
//           <Button onClick={handleEditListClick} variant="contained">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Confirmation Dialog for Deleting List */}
//       <ConfirmationDialog
//         open={deleteDialogOpen}
//         onClose={handleCloseDeleteDialog}
//         onConfirm={handleConfirmDelete}
//         title="Confirm Deletion"
//         content="Are you sure you want to delete this list? This action cannot be undone."
//       />
//     </Container>
//   );
// };

// export default Home;




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
  Paper,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { ListsContext } from "../contexts/ListsContext";

const Home = () => {
  const theme = useTheme();
  const { lists, handleCreateList, handleDeleteList, handleEditList } = useContext(ListsContext);
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={0}
        sx={{
          background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          borderRadius: 4,
          p: 4,
          mb: 4
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <FormatListBulletedIcon 
            sx={{ 
              fontSize: 40,
              color: theme.palette.primary.main
            }} 
          />
          <Typography 
            variant="h4" 
            sx={{
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Expense Lists
          </Typography>
        </Box>

        <List sx={{ mb: 3 }}>
          {lists.map((list, index) => (
            <Fade in={true} timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
              <ListItem
                key={list._id}
                component={Paper}
                elevation={1}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                    bgcolor: alpha(theme.palette.primary.main, 0.05)
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Link
                      to={`/list/${list._id}`}
                      style={{ 
                        textDecoration: "none",
                        color: theme.palette.text.primary,
                        fontWeight: 500
                      }}
                    >
                      {list.name}
                    </Link>
                  }
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Edit List" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEditDialog(list)}
                      sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete List" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDeleteDialog(list._id)}
                      sx={{
                        color: theme.palette.error.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.error.main, 0.1)
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
            </Fade>
          ))}
        </List>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: theme.shadows[2],
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              transform: 'translateY(-1px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Add New List
        </Button>
      </Paper>

      {/* Dialogs with enhanced styling */}
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
            Add New List
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={handleCloseAddDialog}
            sx={{ 
              color: theme.palette.text.secondary,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateListClick} 
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 2
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Edit List Name
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editedListName}
            onChange={(e) => setEditedListName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handleCloseEditDialog}
            sx={{ 
              color: theme.palette.text.secondary,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditListClick} 
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

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
