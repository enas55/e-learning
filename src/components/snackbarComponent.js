import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarComponent = ({ open, message, onClose }) => {
    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
            <Alert onClose={onClose} severity="success">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarComponent;
