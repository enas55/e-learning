import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmText, cancelText }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: "#1C1E53" }}>
                    {cancelText || "Cancel"}
                </Button>
                <Button onClick={onConfirm} sx={{ color: "#1C1E53" }}>
                    {confirmText || "Confirm"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;