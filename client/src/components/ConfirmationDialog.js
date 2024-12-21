// // client/src/components/ConfirmationDialog.js

// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
// } from "@mui/material";

// const ConfirmationDialog = ({ open, onClose, onConfirm, title, content }) => {
//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       aria-labelledby="confirmation-dialog-title"
//       aria-describedby="confirmation-dialog-description"
//     >
//       <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
//       <DialogContent>
//         <DialogContentText id="confirmation-dialog-description">
//           {content}
//         </DialogContentText>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={onConfirm} color="error" autoFocus>
//           Delete
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ConfirmationDialog;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  alpha,
  IconButton,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import { keyframes } from "@mui/system";

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const ConfirmationDialog = ({ open, onClose, onConfirm, title, content }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 3,
          width: "100%",
          maxWidth: "400px",
          overflow: "hidden",
        },
      }}
      TransitionProps={{
        timeout: 300,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, 
            ${theme.palette.error.light}, 
            ${theme.palette.error.main}
          )`,
        }}
      />

      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          pb: 1,
          pr: 6,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          background: alpha(theme.palette.error.main, 0.05),
        }}
      >
        <Typography variant="h6" component="span" fontWeight={600}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
            "&:hover": {
              backgroundColor: alpha(theme.palette.grey[500], 0.1),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <DialogContentText
          id="confirmation-dialog-description"
          sx={{
            color: theme.palette.text.primary,
            fontSize: "1rem",
            pt: 2
          }}
        >
          {content}
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "none",
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.grey[400],
              backgroundColor: alpha(theme.palette.grey[500], 0.05),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          autoFocus
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "none",
            boxShadow: theme.shadows[2],
            background: `linear-gradient(45deg, 
              ${theme.palette.error.main}, 
              ${theme.palette.error.dark}
            )`,
            "&:hover": {
              background: `linear-gradient(45deg, 
                ${theme.palette.error.dark}, 
                ${theme.palette.error.main}
              )`,
              boxShadow: theme.shadows[4],
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
