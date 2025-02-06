import React, { useState} from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";


const EditCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    createdBy: "",
    price: "",
  });

  const [errors, setErrors] = useState({});


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
    if (!formData.price || formData.price <= 0) tempErrors.price = "Price must be positive";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Updated Course Data:", formData);
      alert("Course updated successfully!");
    }
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: "#1C1E53" }}>
          Edit Course
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Title" name="title" value={formData.title} onChange={handleChange} error={Boolean(errors.title)} helperText={errors.title} sx={{ "& label, & input": { color: "#1C1E53" } }} />
          <TextField fullWidth margin="normal" label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} error={Boolean(errors.description)} helperText={errors.description} sx={{ "& label, & input": { color: "#1C1E53" } }} />
          <TextField fullWidth margin="normal" label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} error={Boolean(errors.imageUrl)} helperText={errors.imageUrl} sx={{ "& label, & input": { color: "#1C1E53" } }} />
          <TextField fullWidth margin="normal" label="Created By" name="createdBy" value={formData.createdBy} onChange={handleChange} error={Boolean(errors.createdBy)} helperText={errors.createdBy} sx={{ "& label, & input": { color: "#1C1E53" } }} />
          <TextField fullWidth margin="normal" label="Price" name="price" type="number" value={formData.price} onChange={handleChange} error={Boolean(errors.price)} helperText={errors.price} sx={{ "& label, & input": { color: "#1C1E53" } }} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, bgcolor: "#1C1E53", "&:hover": { bgcolor: "#15173D" } }}>
            Update Course
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditCourse;
