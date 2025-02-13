import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/store';
import { Card, CardContent, CardMedia, Typography, Button, Box, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

function CourseCard({ course, isFavorite, toggleFavorite, isJoined, toggleJoin, isFavoritePage, isDashboardPage }) {
    const dispatch = useDispatch();
    const { language, translations } = useSelector((state) => state.translation);
    const t = translations[language].courseCard;
    const navigate = useNavigate();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage') || 'en';
        dispatch(setLanguage(savedLanguage));
    }, [dispatch]);

    const handleViewCourse = () => {
        navigate(`/course_details/${course.id}`);
    };

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", padding: 2}}>
            <CardMedia component="img" height="140" image={course.image} alt={course.title} />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1, direction: language === "en" ? "ltr" : "rtl" }}>
                    {/* {course.title} */}
                    {language === "en" ? course.title : course.titleAr}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2, direction: language === "en" ? "ltr" : "rtl"}}>
                    {/* {course.description} */}
                    {language === "en" ? course.description : course.descriptionAr}
                </Typography>
                <Typography variant="body1" sx={{ color: "#1C1E53", fontWeight: "bold", direction: language === "en" ? "ltr" : "rtl"}}>
                    {t.Price} ${course.price}
                </Typography>
            </CardContent>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                    <Button
                        variant={isJoined ? "outlined" : "contained"}
                        onClick={() => toggleJoin(course.id)}
                        sx={{
                            backgroundColor: isJoined ? "transparent" : "#1C1E53",
                            color: isJoined ? "#4CAF50" : "white",
                            borderColor: isJoined ? "#4CAF50" : "transparent",
                            '&:hover': {
                                backgroundColor: isJoined ? "transparent" : "#1C1E53",
                                borderColor: isJoined ? "#4CAF50" : "transparent",
                            }
                        }}
                    >
                        {isJoined ? t.Joined : t.Join}
                    </Button>

                    {!isDashboardPage && (
                        isFavoritePage ? (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => toggleFavorite(course.id)}
                                sx={{ flex: 1 }}
                            >
                                {t.Remove}
                            </Button>
                        ) : (
                            <IconButton
                                color={isFavorite ? "error" : "default"}
                                onClick={() => toggleFavorite(course.id)}
                            >
                                {isFavorite ? <Favorite /> : <FavoriteBorder />}
                            </IconButton>
                        )
                    )}
                </Box>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1C1E53" }}
                    onClick={handleViewCourse}
                >
                    {t.View_Course}
                </Button>
            </Box>
        </Card>
    );
}

export default CourseCard;