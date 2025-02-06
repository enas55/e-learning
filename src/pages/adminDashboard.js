import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {Delete, Edit, Add } from '@mui/icons-material';

const dashboardItems = [
  { title: 'Add Course',icon: <Add fontSize="large" />, path: "/add-course" },
  { title: 'Edit Course',icon: <Edit fontSize="large" />, path: "/edit-course" },
  { title: 'Delete Course',icon: <Delete fontSize="large" />, path: "/delete-course" }
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg">
      <Typography 
        variant="h3" 
        sx={{ 
          marginBottom: 4, 
          marginTop: 4, 
          textAlign: "center", 
          color: "#1C1E53", 
          fontWeight: "bold" 
        }}
      >
        Admin Dashboard
      </Typography>

      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: 4, 
          marginBottom: 6 
        }}
      >
        {dashboardItems.map((item, index) => (
          <Card 
            key={index} 
            sx={{ 
              textAlign: 'center', 
              padding: 2, 
              boxShadow: 3, 
              borderRadius: 2, 
              cursor: "pointer", 
              transition: "0.3s", 
              "&:hover": { boxShadow: 6 } 
            }}
            onClick={() => handleCardClick(item.path)}
          >
            <CardContent>
              <Box sx={{ color: '#1C1E53', marginBottom: 1 }}>
                {item.icon}
              </Box>
              <Typography variant="h6" fontWeight="bold">
                {item.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default AdminDashboard;
