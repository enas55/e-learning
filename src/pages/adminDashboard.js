import React, {useEffect} from "react";
import { Container, Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";
import DashboardCard from "../components/dashboardCard";
import { Add, Edit, Person, Book} from "@mui/icons-material";
import { useLocation} from "react-router-dom";

function AdminDashboard (){
  const { translations, language } = useSelector((state) => state.translation);
  const t = translations[language].adminDashboard;
  const pageNameT = translations[language].pageNames;
  const location = useLocation();

  useEffect(() => {
    document.title = pageNameT.Admin_Dshboard_Page;
}, [location, pageNameT]);

  const dashboardItems = [
    { title: t.Add_Course, icon: <Add fontSize="large" />, path: "/add-course" },
    { title: t.Edit_Course, icon: <Edit fontSize="large" />, path: "/edit-course" },
    { title: t.Users, icon: <Person fontSize="large" />, path: "/users" },
    { title: t.Joined_Courses_Page, icon: <Book fontSize="large" />, path: "/joined-courses" },
  ];

  return (
    <Container maxWidth="lg" sx={{direction: language === "en" ? "ltr" : "rtl"}}>
      <Typography
        variant="h3"
        sx={{
          marginBottom: 4,
          marginTop: 4,
          textAlign: "center",
          color: "#1C1E53",
        }}
      >
        {t.Admin_Dashboard}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 4,
          marginBottom: 20,
          marginTop:10
          
        }}
      >
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            icon={item.icon}
            path={item.path}
          />
        ))}
      </Box>
    </Container>
  );
};

export default AdminDashboard;