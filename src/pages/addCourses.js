import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddCourse = ({ onCourseAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    createdBy: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = "Title is required";
    if (!formData.description) tempErrors.description = "Description is required";
    if (!formData.imageUrl) tempErrors.imageUrl = "Image URL is required";
    if (!/^https?:\/\/.+/.test(formData.imageUrl)) tempErrors.imageUrl = "Invalid URL";
    if (!formData.createdBy) tempErrors.createdBy = "Creator name is required";
    if (!formData.price || formData.price <= 0) tempErrors.price = "Price must be a positive number";

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
          imageUrl: formData.imageUrl,
          createdBy: formData.createdBy,
          price: Number(formData.price),
          createdAt: serverTimestamp(),
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

        setFormData({ title: "", description: "", imageUrl: "", createdBy: "", price: "" });
        setErrors({});
      } catch (error) {
        console.error("Error adding course:", error);
      }
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, color: "#1C1E53", margin: "auto", mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Add New Course
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
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
            label="Description"
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
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            error={Boolean(errors.imageUrl)}
            helperText={errors.imageUrl}
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
            label="Created By"
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
            label="Price"
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#1C1E53" }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCourse;
