import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Modal,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Edit, Delete, Close } from "@mui/icons-material";
import ConfirmDialog from "../components/confirmDialog";
import SnackbarComponent from "../components/snackbarComponent";
import { useSelector } from "react-redux";
import { useLocation} from "react-router-dom";

function EditCourse (){
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      image: "",
      createdBy: "",
      creatorAr : "",
      price: "",
  });
  const [errors, setErrors] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const [coursesPerPage] = useState(5);
  const location = useLocation();
  const { translations, language } = useSelector((state) => state.translation);
  const t = translations[language].editCourse;
  const snackbarT = translations[language].snackbar;
  const confirmDialogT = translations[language].confirmDialog;
  const pageNameT = translations[language].pageNames;
  const addCourseT = translations[language].addCourse;

  useEffect(() => {
    document.title = pageNameT.Edit_Course_Page;
}, [location, pageNameT]);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      titleAr : course.titleAr,
      description: course.description,
      descriptionAr : course.descriptionAr,
      image: course.image,
      createdBy: course.createdBy,
      creatorAr: course.creatorAr,
      price: course.price,
      category : course.category,
      catAr : course.catAr
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCourse(null);
    setFormData({
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      image: "",
      createdBy: "",
      creatorAr : "",
      price: "",
    });
  };

  const handleUpdateCourse = async () => {
    if (validate()) {
      const hasChanges = Object.keys(formData).some(
        (key) => formData[key] !== selectedCourse[key]
      );

      if (!hasChanges) {
        setSnackbarMessage(snackbarT.Snackbar_No_Changes);
        setOpenModal(false);
        setSnackbarOpen(true);
        return;
      }

      try {
        const courseRef = doc(db, "courses", selectedCourse.id);
        await updateDoc(courseRef, formData);
        setSnackbarMessage(snackbarT.Snackbar_Course_Update);
        setSnackbarOpen(true);
        handleCloseModal();
        const updatedCourses = courses.map((course) =>
          course.id === selectedCourse.id ? { ...course, ...formData } : course
        );
        setCourses(updatedCourses);
      } catch (error) {
        console.error("Error updating course:", error);
      }
    }
  };

  const handleDeleteClick = (courseId) => {
    setCourseToDelete(courseId);
    setOpenConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDoc(doc(db, "courses", courseToDelete));
      setSnackbarMessage(snackbarT.Snackbar_Course_Delete);
      setSnackbarOpen(true);
      const updatedCourses = courses.filter((course) => course.id !== courseToDelete);
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setOpenConfirmDialog(false);
      setCourseToDelete(null);
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = addCourseT.Title_Valid;
    if (!formData.titleAr) tempErrors.title = addCourseT.Title_Valid;
    if (!formData.description) tempErrors.description = addCourseT.Description_Valid;
    if (!formData.descriptionAr) tempErrors.description = addCourseT.Description_Valid;
    if (!formData.image) tempErrors.image = addCourseT.Img_URL_Valid;
    if (!/^https?:\/\/.+/.test(formData.image)) tempErrors.image = addCourseT.Img_URL_Valid_2;
    if (!formData.createdBy) tempErrors.createdBy = addCourseT.Creator_Valid;
    if (!formData.creatorAr) tempErrors.createdBy = addCourseT.Creator_Valid;
    if (!formData.price || formData.price <= 0) tempErrors.price = addCourseT.Price_Valid;
    if (!formData.category) tempErrors.category = addCourseT.Category_Valid;
    if (!formData.catAr) tempErrors.category = addCourseT.Category_Valid;

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 4, color: "#1C1E53", direction: language === "en" ? "ltr" : "rtl"}}>
        {t.Main_Title}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, padding: 4 }}>
          <CircularProgress sx={{color: "#1C1E53"}} />
        </Box>
      ) : (
        <>
          <List>
            {currentCourses.map((course) => (
              <ListItem
                key={course.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  
                }}
              >
                <ListItemText
                  primary={language === "en" ? course.title : course.titleAr}
                  secondary={language === "en" ? `Created by: ${course.createdBy} - Price: $${course.price}` : `تم الإنشاء بواسطة:  ${course.creatorAr} - السعر: $${course.price}`}
                  
                />
                <Box>
                  <IconButton onClick={() => handleEditClick(course)}>
                    <Edit sx={{ color: "#1C1E53" }} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(course.id)}>
                    <Delete sx={{ color: "#FF0000" }} />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
            <Pagination
              count={Math.ceil(courses.length / coursesPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              sx={{
                "& .MuiPaginationItem-root": {
                    color: "#1C1E53",
                },
                "& .MuiPaginationItem-previousNext": {
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#1C1E53" }}>
              {t.Main_Title}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </Box>
          <form>
            <TextField
              fullWidth
              margin="normal"
              label= {t.Title_Label}
              name= {language === "en" ? "title" : "titleAr"}
              value={language === "en" ? formData.title : formData.titleAr}
              onChange={handleChange}
              error={Boolean(errors.title)}
              helperText={errors.title}
              sx={{
                "& .MuiInputLabel-root": { color: "#1C1E53" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#1C1E53" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#1C1E53" }
                }
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label= {t.Description_Label}
              name= {language === "en" ? "description" : "descriptionAr"}
              multiline
              rows={3}
              value={language === "en" ? formData.description : formData.descriptionAr}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
              sx={{
                "& .MuiInputLabel-root": { color: "#1C1E53" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#1C1E53" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#1C1E53" }
                }
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label= {t.Image_URL_Label}
              name="image"
              value={formData.image}
              onChange={handleChange}
              error={Boolean(errors.image)}
              helperText={errors.image}
              sx={{
                "& .MuiInputLabel-root": { color: "#1C1E53" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#1C1E53" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#1C1E53" }
                }
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label= {t.Created_By_Label}
              name= {language === "en" ? "createdBy" : "creatorAr"}
              value={language === "en" ? formData.createdBy : formData.creatorAr}
              onChange={handleChange}
              error={Boolean(errors.createdBy)}
              helperText={errors.createdBy}
              sx={{
                "& .MuiInputLabel-root": { color: "#1C1E53" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#1C1E53" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#1C1E53" }
                }
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label= {t.Price_Label}
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={Boolean(errors.price)}
              helperText={errors.price}
              sx={{
                "& .MuiInputLabel-root": { color: "#1C1E53" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#1C1E53" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#1C1E53" }
                }
              }}
            />
            <TextField
                        fullWidth
                        margin="normal"
                        label= {addCourseT.Category}
                        name={language === "en" ? "category" : "catAr"}
                        value={language === "en" ? formData.category : formData.catAr}
                        onChange={handleChange}
                        error={Boolean(errors.category)}
                        helperText={errors.category}
                        sx={{
                          "& .MuiInputLabel-root": { color: "#1C1E53" },
                          "& .MuiInputLabel-root.Mui-focused": { color: "#1C1E53" },
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": { borderColor: "#1C1E53" }
                          }
                        }}
                      />
            <Button
              variant="contained"
              onClick={handleUpdateCourse}
              fullWidth
              sx={{ mt: 2, bgcolor: "#1C1E53", "&:hover": { bgcolor: "#15173D" } }}
            >
              {t.Save_Changes_Btn}
            </Button>
          </form>
        </Box>
      </Modal>

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleDeleteConfirm}
        title= {confirmDialogT.Delete_Course_Title}
        message= {confirmDialogT.Delete_Course_Msg}
        confirmText= {confirmDialogT.Delete_Btn}
        cancelText= {confirmDialogT.Cancel_Text}
      />

      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Container>
  );
};

export default EditCourse;