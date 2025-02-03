import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/store';
import { Card, CardContent, CardMedia, Typography, Button, Box, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

function CourseCard({ course, isFavorite, toggleFavorite, isJoined, toggleJoin }) {
    const dispatch = useDispatch();
            const { language, translations } = useSelector((state) => state.translation);
            const t = translations[language].courseCard;
    
            useEffect(() => {
                    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
                    dispatch(setLanguage(savedLanguage));
                }, [dispatch]);
    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardMedia component="img" height="140" image={course.image} alt={course.title} />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                </Typography>
                <Typography variant="body1" sx={{ color: "#1C1E53" }}>
                    {t.Price} ${course.price}
                </Typography>
            </CardContent>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: "#1C1E53" }}>
                    {t.View_Course}
                </Button>

                <Box>
                    <Button
                        variant={isJoined ? "outlined" : "contained"}
                        onClick={() => toggleJoin(course.id, course.title)}
                        sx={{
                            backgroundColor: isJoined ? "transparent" : "#1C1E53",
                            color: isJoined ? "#4CAF50" : "white",
                            borderColor: isJoined ? "#4CAF50" : "transparent",
                            mr: 1,
                            '&:hover': {
                                backgroundColor: isJoined ? "transparent" : "#1C1E53",
                                borderColor: isJoined ? "#4CAF50" : "transparent",
                            }
                        }}
                    >
                        {isJoined ? t.Joined : t.Join}
                    </Button>
                    
                    <IconButton
                        color={isFavorite ? "error" : "default"}
                        onClick={() => toggleFavorite(course.id, course.title)}
                    >
                        {isFavorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                </Box>
            </Box>
        </Card>
    );
}

export default CourseCard;