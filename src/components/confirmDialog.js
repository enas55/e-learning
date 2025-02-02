import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="#1C1E53">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error">
                    Remove
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
