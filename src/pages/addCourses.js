import React, { useState, useEffect } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import SnackbarComponent from "../components/snackbarComponent";
import { useSelector } from "react-redux";
import { useLocation} from "react-router-dom";

function AddCourse ({ onCourseAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    createdBy: "",
    price: "",
    category: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { translations, language } = useSelector((state) => state.translation);
  const t = translations[language].addCourse;
  const snackbarT = translations[language].snackbar;
  const pageNameT = translations[language].pageNames;
  const location = useLocation();

  useEffect(() => {
    document.title = pageNameT.Add_Course_Page;
}, [location, pageNameT]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = t.Title_Valid;
    if (!formData.description) tempErrors.description = t.Description_Valid;
    if (!formData.image) tempErrors.image = t.Img_URL_Valid;
    if (!/^https?:\/\/.+/.test(formData.image)) tempErrors.image = t.Img_URL_Valid_2;
    if (!formData.createdBy) tempErrors.createdBy = t.Creator_Valid;
    if (!formData.price || formData.price <= 0) tempErrors.price = t.Price_Valid;
    if (!formData.category) tempErrors.category = t.Category_Valid;

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const docRef = await addDoc(collection(db, "courses"), {
          title: formData.title,
          description: formData.description,
          image: formData.image,
          createdBy: formData.createdBy,
          price: Number(formData.price),
          category: formData.category,
        });
        console.log("Course added with ID:", docRef.id);

        if (onCourseAdded) {
          onCourseAdded({
            id: docRef.id,
            ...formData,
            price: Number(formData.price),
            createdAt: new Date(),
          });
        }

        setFormData({ title: "", description: "", image: "", createdBy: "", price: "", category: "" });
        setErrors({});

        setOpenSnackbar(true);
      } catch (error) {
        console.error("Error adding course:", error);
      }
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card sx={{ maxWidth: 500, color: "#1C1E53", margin: "auto", mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {t.Add_New_Course}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label= {t.Title}
            name="title"
            value={formData.title}
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
            label= {t.Description}
            name="description"
            multiline
            rows={3}
            value={formData.description}
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
            label= {t.Img_URL}
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
            label= {t.Created_by}
            name="createdBy"
            value={formData.createdBy}
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
            label= {t.Price}
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
            label= {t.Category}
            name="category"
            value={formData.category}
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
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#1C1E53" , padding: 1}}
            disabled={loading}
          >
            {loading ? t.Loading : t.Add_Course_Btn}
          </Button>
        </form>
      </CardContent>

      
      <SnackbarComponent
        open={openSnackbar}
        message= {snackbarT.Snackbar_Added_New_Course}
        onClose={handleCloseSnackbar}
      />
    </Card>
  );
};

export default AddCourse;