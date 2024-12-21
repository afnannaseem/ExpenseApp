// // client/src/components/Navbar.js

// import React, { useContext, useState } from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import AddIcon from "@mui/icons-material/Add";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import MenuIcon from "@mui/icons-material/Menu";
// import IconButton from "@mui/material/IconButton";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import Tooltip from "@mui/material/Tooltip";
// import { makeStyles } from "@mui/styles";
// import Drawer from "@mui/material/Drawer";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import Divider from "@mui/material/Divider";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import ConfirmationDialog from "./ConfirmationDialog";
// import { ListsContext } from "../contexts/ListsContext"; // Import the context

// const useStyles = makeStyles((theme) => ({
//   title: {
//     flexGrow: 1,
//     textDecoration: "none",
//     color: "inherit",
//   },
//   iconButton: {
//     marginLeft: theme.spacing(1),
//   },
//   list: {
//     width: 250,
//   },
//   addButton: {
//     margin: theme.spacing(2),
//   },
// }));

// const Navbar = () => {
//   const classes = useStyles();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [addDialogOpen, setAddDialogOpen] = useState(false);
//   const [newListName, setNewListName] = useState("");
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [listToDelete, setListToDelete] = useState(null);

//   // Consume the ListsContext
//   const { lists, handleCreateList, handleDeleteList } =
//     useContext(ListsContext);

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const showBackButton = location.pathname !== "/";

//   const toggleDrawer = (open) => (event) => {
//     if (
//       event &&
//       event.type === "keydown" &&
//       (event.key === "Tab" || event.key === "Shift")
//     ) {
//       return;
//     }
//     setDrawerOpen(open);
//   };

//   const sideList = (event) => (
//     <Box
//       className={classes.list}
//       role="presentation"
//       onClick={toggleDrawer(false)}
//       onKeyDown={toggleDrawer(false)}
//     >
//       <Typography variant="h6" sx={{ padding: 2 }}>
//         Expense Lists
//       </Typography>
//       <Divider />
//       <List>
//         {lists.map((list) => (
//           <ListItem
//             button
//             key={list._id}
//             component={Link}
//             to={`/list/${list._id}`}
//           >
//             <ListItemText primary={list.name} />
//           </ListItem>
//         ))}
//       </List>
//       <Divider />
//       <List>
//         <ListItem
//           button
//           onClick={(event) => {
//             event.stopPropagation(); // Prevent triggering the Drawer onClick
//             toggleDrawer(false)(event);
//             handleOpenAddDialog();
//           }}
//         >
//           <AddIcon sx={{ marginRight: 1 }} />
//           <ListItemText primary="Add New List" />
//         </ListItem>
//       </List>
//     </Box>
//   );

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

//   // Open Delete Confirmation Dialog
//   const handleOpenDeleteDialog = (id) => {
//     setListToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   // Close Delete Confirmation Dialog
//   const handleCloseDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//     setListToDelete(null);
//   };

//   // Confirm Deletion
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

//   return (
//     <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
//       <AppBar position="static" color="primary">
//         <Toolbar>
//           {showBackButton && (
//             <Tooltip title="Go Back">
//               <IconButton
//                 edge="start"
//                 color="inherit"
//                 aria-label="back"
//                 onClick={handleBack}
//                 className={classes.iconButton}
//               >
//                 <ArrowBackIcon />
//               </IconButton>
//             </Tooltip>
//           )}
//           <Tooltip title="Menu">
//             <IconButton
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               onClick={toggleDrawer(true)}
//               className={classes.iconButton}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Tooltip>
//           <Typography
//             variant="h6"
//             component={Link}
//             to="/"
//             className={classes.title}
//           >
//             Expense Tracker
//           </Typography>
//           <Tooltip title="Add New List">
//             <IconButton
//               color="inherit"
//               onClick={handleOpenAddDialog}
//               className={classes.iconButton}
//             >
//               <AddIcon />
//             </IconButton>
//           </Tooltip>
//         </Toolbar>
//       </AppBar>
//       <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
//         {sideList()}
//       </Drawer>

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

//       {/* Confirmation Dialog for Deleting List */}
//       <ConfirmationDialog
//         open={deleteDialogOpen}
//         onClose={handleCloseDeleteDialog}
//         onConfirm={handleConfirmDelete}
//         title="Confirm Deletion"
//         content="Are you sure you want to delete this list? This action cannot be undone."
//       />
//     </Box>
//   );
// };

// export default Navbar;


import React, { useContext, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  alpha,
  Avatar,
  ListItemIcon,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HomeIcon from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";
import { ListsContext } from "../contexts/ListsContext";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const { lists, handleCreateList, handleDeleteList } = useContext(ListsContext);

  const handleBack = () => navigate(-1);
  const showBackButton = location.pathname !== "/";

  const toggleDrawer = (open) => (event) => {
    if (event?.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleOpenAddDialog = () => setAddDialogOpen(true);
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

  const DrawerContent = () => (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Expense Tracker
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          Manage your expenses efficiently
        </Typography>
      </Box>

      <List sx={{ flex: 1, pt: 2 }}>
        
        <Typography
          variant="overline"
          sx={{ px: 3, color: theme.palette.text.secondary }}
        >
          Your Lists
        </Typography>

        {lists.map((list, index) => (
          <Fade in key={list._id} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
            <ListItem
              button
              component={Link}
              to={`/list/${list._id}`}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
              }}
            >
              <ListItemIcon>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <FormatListBulletedIcon sx={{ fontSize: 16 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={list.name}
                primaryTypographyProps={{ fontSize: "0.95rem" }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOpenDeleteDialog(list._id);
                }}
                sx={{
                  opacity: 0.6,
                  "&:hover": {
                    opacity: 1,
                    color: theme.palette.error.main,
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          </Fade>
        ))}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={(event) => {
            event.stopPropagation();
            toggleDrawer(false)(event);
            handleOpenAddDialog();
          }}
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          }}
        >
          Add New List
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, mb: 2 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        }}
      >
        <Toolbar>
          {showBackButton ? (
            <Tooltip title="Go Back" arrow>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Menu" arrow>
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawer(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 600,
            }}
          >
            Expense Tracker
          </Typography>

          <Tooltip title="Add New List" arrow>
            <IconButton color="inherit" onClick={handleOpenAddDialog}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            borderRadius: "0 12px 12px 0",
          },
        }}
      >
        <DrawerContent />
      </Drawer>

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
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateListClick}
            variant="contained"
            sx={{
              px: 3,
              textTransform: "none",
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            }}
          >
            Add List
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
    </Box>
  );
};

export default Navbar;
