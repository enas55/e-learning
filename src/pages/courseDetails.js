import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Card,
    CardMedia,
    CardContent,
    Stack,
    Button,
    IconButton,
} from '@mui/material';
import { Star, Favorite, FavoriteBorder } from '@mui/icons-material';
import ConfirmDialog from '../components/confirmDialog';
import SnackbarComponent from '../components/snackbarComponent';

function CourseDetails() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (courseDoc.exists()) {
                    setCourse({ id: courseDoc.id, ...courseDoc.data() });
                } else {
                    console.error('Course not found');
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    const handleJoinClick = () => {
        if (isJoined) {
            setConfirmDialogOpen(true); // Open confirm dialog if already joined
        } else {
            setIsJoined(true); // Join the course
            setSnackbarOpen(true); // Show snackbar
        }
    };

    const handleUnjoinConfirm = () => {
        setIsJoined(false); // Unjoin the course
        setConfirmDialogOpen(false); // Close confirm dialog
    };

    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
        if (!isFavorite) {
            alert('Course added to favorites!');
        } else {
            alert('Course removed from favorites!');
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!course) {
        return (
            <Container>
                <Typography variant="h4" sx={{ mt: 4 }}>
                    Course not found
                </Typography>
            </Container>
        );
    }

    return (
        <Box>
            <Container sx={{ mt: 6, mb: 6 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    <Box sx={{ flex: 1 }}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="300"
                                image={course.image}
                                alt={course.title}
                            />
                        </Card>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h3" gutterBottom>
                                    {course.title}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {course.description}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#1C1E53', mb: 2 }}>
                                    Price: ${course.price}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#1C1E53' }}>
                                    Created By: {course.createdBy}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                                    <Typography variant="h6" sx={{ color: '#1C1E53' }}>
                                        Rate: {course.rating}
                                    </Typography>
                                    <Star sx={{ color: 'gold' }} />
                                </Stack>
                                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                                    <Button
                                        variant={isJoined ? 'outlined' : 'contained'}
                                        sx={{
                                            backgroundColor: isJoined ? 'transparent' : '#1C1E53',
                                            color: isJoined ? '#4CAF50' : 'white',
                                            borderColor: isJoined ? "#4CAF50" : "transparent",
                                            '&:hover': {
                                                backgroundColor: isJoined ? "transparent" : "#1C1E53",
                                                borderColor: isJoined ? "#4CAF50" : "transparent",
                                            }
                                        }}
                                        onClick={handleJoinClick}
                                    >
                                        {isJoined ? 'Joined' : 'Join'}
                                    </Button>
                                    <IconButton
                                        color={isFavorite ? 'error' : 'default'}
                                        onClick={handleFavoriteClick}
                                    >
                                        {isFavorite ? <Favorite /> : <FavoriteBorder />}
                                    </IconButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Stack>
            </Container>

            {/* Snackbar for join confirmation */}
            <SnackbarComponent
                open={snackbarOpen}
                message="You have joined this course!"
                onClose={handleSnackbarClose}
            />

            {/* Confirm Dialog for unjoin confirmation */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={handleConfirmDialogClose}
                onConfirm={handleUnjoinConfirm}
                title="Unjoin Course"
                message="Are you sure you want to unjoin this course?"
                confirmText="Unjoin"
                cancelText="Cancel"
            />
        </Box>
    );
}

export default CourseDetails;