import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const DeleteCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleDelete = () => {
    console.log(`Course with ID ${courseId} deleted.`);
    navigate("/all-courses");
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", mt: 5, p: 3, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5" sx={{ color: "#1C1E53", mb: 2 }}>
          Confirm Delete
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Are you sure you want to delete this course?
        </Typography>
        <Button variant="contained" color="error" fullWidth onClick={handleDelete} sx={{ mb: 2 }}>
          Delete Course
        </Button>
        <Button variant="outlined" sx={{ color: "#1C1E53"}} fullWidth onClick={() => navigate("/all-courses")}>
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeleteCourse;
