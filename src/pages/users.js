import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
  Box,
  Pagination,
} from "@mui/material";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Delete } from "@mui/icons-material";
import ConfirmDialog from "../components/confirmDialog";
import SnackbarComponent from "../components/snackbarComponent";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openAdminConfirmDialog, setOpenAdminConfirmDialog] = useState(false);
  const [openRoleChangeDialog, setOpenRoleChangeDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
const { translations, language } = useSelector((state) => state.translation);
  const t = translations[language].users;
  const pageNameT = translations[language].pageNames;
  const confirmDialogT = translations[language].confirmDialog;
  const snackbarT = translations[language].snackbar;
  const location = useLocation();

  useEffect(() => {
    document.title = pageNameT.Users_Page;
  }, [location, pageNameT]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleRoleChange = async (userId, newRole) => {
    const user = users.find((user) => user.id === userId);

    if (user.role === "admin" && newRole === "user") {
      setOpenRoleChangeDialog(true);
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      setSnackbarMessage(snackbarT.Snackbar_User_To_Admin);
      setSnackbarOpen(true);

      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (userId) => {
    const user = users.find((user) => user.id === userId);
    if (user.role === "admin") {
      setOpenAdminConfirmDialog(true);
    } else {
      setUserToDelete(userId);
      setOpenConfirmDialog(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDoc(doc(db, "users", userToDelete));
      setSnackbarMessage(snackbarT.Snackbar_User_Delete);
      setSnackbarOpen(true);

      const updatedUsers = users.filter((user) => user.id !== userToDelete);
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    } finally {
      setOpenConfirmDialog(false);
      setUserToDelete(null);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 4, color: "#1C1E53", textAlign: "center" }}>
          {t.Title}
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: "#1C1E53", padding: 2 }} />
          </Box>
        ) : (
          <>
            <List sx={{ margin: 6 }}>
              {currentUsers.map((user) => (
                <ListItem
                  key={user.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ListItemText
                    primary={user.email}
                    secondary={`Role: ${user.role}`}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      sx={{
                        minWidth: 120,
                        mr: 2,
                        color: "#1C1E53",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1C1E53",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1C1E53",
                        },
                      }}
                    >
                      <MenuItem value="user">{t.User}</MenuItem>
                      <MenuItem value="admin">{t.Admin}</MenuItem>
                    </Select>
                    <IconButton onClick={() => handleDeleteClick(user.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
              <Pagination
                count={Math.ceil(users.length / usersPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#1C1E53",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#1C1E53",
                    color: "white",
                  },
                }}
              />
            </Box>
          </>
        )}
      </CardContent>

      {/* Confirm dialog for deleting users */}
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleDeleteConfirm}
        title={confirmDialogT.Delete_User}
        message={confirmDialogT.Delete_User_Msg}
        confirmText={confirmDialogT.Delete_Btn}
        cancelText={confirmDialogT.Cancel_Text}
      />

      {/* Confirm dialog for deleting admins */}
      <ConfirmDialog
        open={openAdminConfirmDialog}
        onClose={() => setOpenAdminConfirmDialog(false)}
        onConfirm={() => setOpenAdminConfirmDialog(false)}
        message={confirmDialogT.Delete_Admin_Msg}
        confirmText={confirmDialogT.Ok_Btn}
        cancelText={confirmDialogT.Cancel_Text}
      />

      {/* Confirm dialog for changin admin to user */}
      <ConfirmDialog
        open={openRoleChangeDialog}
        onClose={() => setOpenRoleChangeDialog(false)}
        onConfirm={() => setOpenRoleChangeDialog(false)}
        message={confirmDialogT.Role_Change_Msg}
        confirmText={confirmDialogT.Ok_Btn}
        cancelText={confirmDialogT.Cancel_Text}
      />

      {/* Snackbar */}
      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Card>
  );
}

export default Users;