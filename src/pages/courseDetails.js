import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite, setFavorites } from '../redux/store';

function CourseDetails() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmFavoriteDialogOpen, setConfirmFavoriteDialogOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const dispatch = useDispatch();
    const favoriteCourses = useSelector((state) => state.favorites.favoriteCourses);
    const { translations, language } = useSelector((state) => state.translation);
    const t = translations[language].confirmDialog;
    const snackbarT = translations[language].snackbar;
    const courseDetailsT = translations[language].courseDetails;
    const pageNameT = translations[language].pageNames;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = pageNameT.Course_Details_Page;
    }, [location, pageNameT]);

    const loadJoinedCourses = useCallback(async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.joinedCourses) {
                    setIsJoined(userData.joinedCourses.includes(courseId));
                }
            }
        } catch (error) {
            console.error("Error loading joined courses:", error);
        }
    }, [courseId]);

    const loadFavorites = useCallback(async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                dispatch(setFavorites(userData.favoriteCourses || []));
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                loadJoinedCourses(user.uid);
                loadFavorites(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, [loadJoinedCourses, loadFavorites]);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (courseDoc.exists()) {
                    setCourse({ id: courseDoc.id, ...courseDoc.data() });
                    setIsFavorite(favoriteCourses.includes(courseDoc.id));
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
    }, [courseId, favoriteCourses]);

    const handleJoinClick = () => {
        if (!userId) {
            navigate('/auth');
            return;
        }

        if (isJoined) {
            setConfirmDialogOpen(true);
        } else {
            handleJoinConfirm();
        }
    };

    const handleJoinConfirm = async () => {
        if (userId) {
            const userRef = doc(db, "users", userId);
            if (isJoined) {
                await updateDoc(userRef, {
                    joinedCourses: arrayRemove(courseId)
                });
                setSnackbarMessage(snackbarT.Snackbar_Unjoined_Courses);
            } else {
                await updateDoc(userRef, {
                    joinedCourses: arrayUnion(courseId)
                });
                setSnackbarMessage(snackbarT.Snackbar_Joined_Courses);
            }
            setIsJoined(!isJoined);
            setSnackbarOpen(true);
            setConfirmDialogOpen(false);
        }
    };

    const handleFavoriteClick = async () => {
        if (!userId) {
            navigate('/auth');
        }

        if (isFavorite) {
            setConfirmFavoriteDialogOpen(true);
        } else {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                favoriteCourses: arrayUnion(courseId)
            });
            dispatch(addFavorite(courseId));
            setSnackbarMessage(snackbarT.Snackbar_Added_to_Fav);
            await loadFavorites(userId);
            setIsFavorite(true);
            setSnackbarOpen(true);
        }
    };

    const handleRemoveFavoriteConfirm = async () => {
        if (userId) {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                favoriteCourses: arrayRemove(courseId)
            });
            dispatch(removeFavorite(courseId));
            setSnackbarMessage(snackbarT.Snackbar_Remove_From_Fav);
            await loadFavorites(userId);
            setIsFavorite(false);
            setSnackbarOpen(true);
        }
        setConfirmFavoriteDialogOpen(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialogOpen(false);
    };

    const handleConfirmFavoriteDialogClose = () => {
        setConfirmFavoriteDialogOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress sx={{ color: "#1C1E53" }} />
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
            <Container sx={{ mt: 6, mb: 6, direction: language === "en" ? "ltr" : "rtl"}}>
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
                    <Box sx={{ flex: 1}}>
                        <Card>
                            <CardContent>
                                <Typography variant="h3" gutterBottom>
                                    {/* {course.title} */}
                                    {language === "en" ? course.title : course.titleAr}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {/* {course.description} */}
                                    {language === "en" ? course.description : course.descriptionAr}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#1C1E53', mb: 2 }}>
                                    {courseDetailsT.Price} ${course.price}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#1C1E53' }}>
                                    {courseDetailsT.Created_By} {language === "en" ? course.createdBy : course.creatorAr}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                                    <Typography variant="h6" sx={{ color: '#1C1E53' }}>
                                        {courseDetailsT.Rate} {course.rating}
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
                                        {isJoined ? courseDetailsT.Unjoin : courseDetailsT.Join}
                                    </Button>
                                    <IconButton
                                        color={isFavorite ? 'error' : 'default'}
                                        onClick={handleFavoriteClick}
                                    >
                                        {isFavorite ? <Favorite /> : <FavoriteBorder/>}
                                    </IconButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Stack>
            </Container>

            {/* snackbar */}
            <SnackbarComponent
                open={snackbarOpen}
                message={snackbarMessage}
                onClose={handleSnackbarClose}
            />

            {/* confirm dialog for unjoin */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={handleConfirmDialogClose}
                onConfirm={handleJoinConfirm}
                title={t.Unjoin_Course_Title}
                message={t.Unjoin_Course_Msg}
                confirmText={t.Confirm_Text_Unjoin}
                cancelText={t.Cancel_Text}
            />

            {/* confirm dialog for removing from fav */}
            <ConfirmDialog
                open={confirmFavoriteDialogOpen}
                onClose={handleConfirmFavoriteDialogClose}
                onConfirm={handleRemoveFavoriteConfirm}
                title={t.RemoveFavTitle}
                message={t.RemoveFavMsg}
                confirmText={t.Confirm_Text_Fav}
                cancelText={t.Cancel_Text}
            />
        </Box>
    );
}

export default CourseDetails;