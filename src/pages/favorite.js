import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import CourseCard from '../components/courseCard';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import ConfirmDialog from '../components/confirmDialog';
import { useDispatch, useSelector } from 'react-redux';
import { removeFavorite, setFavorites} from '../redux/store';
import CustomSnackbar from '../components/snackbarComponent';

function Favorite() {
    const [favoriteCourses, setFavoriteCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [courseToRemove, setCourseToRemove] = useState(null);
    const [joinedCourses, setJoinedCourses] = useState({});
    const [openJoinDialog, setOpenJoinDialog] = useState(false);
    const [courseToJoin, setCourseToJoin] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const user = auth.currentUser;
    const dispatch = useDispatch();
    const { language, translations } = useSelector((state) => state.translation);
    const t = translations[language].favorite;
    const confirmDialogT = translations[language].confirmDialog;
    const snackbarT = translations[language].snackbar;

    // fetch fav courses
    const fetchFavoriteCourses = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const favoriteCourseIds = userSnap.data().favoriteCourses || [];
                if (favoriteCourseIds.length > 0) {
                    const coursesRef = collection(db, "courses");
                    const coursesSnapshot = await getDocs(coursesRef);
                    const coursesData = coursesSnapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(course => favoriteCourseIds.includes(course.id));

                    setFavoriteCourses(coursesData);
                    dispatch(setFavorites(coursesData));
                } else {
                    setFavoriteCourses([]);
                    dispatch(setFavorites([]));
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [user, dispatch]);

    // load joined courses
    const loadJoinedCourses = useCallback(async () => {
        if (!user) return;

        try {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const joinedCoursesMap = {};
                if (userData.joinedCourses) {
                    userData.joinedCourses.forEach((courseId) => {
                        joinedCoursesMap[courseId] = true;
                    });
                }
                setJoinedCourses(joinedCoursesMap);
            }
        } catch (error) {
            console.error(error);
        }
    }, [user]);

    useEffect(() => {
        fetchFavoriteCourses();
        loadJoinedCourses();
    }, [fetchFavoriteCourses, loadJoinedCourses]);

    // removing a course from favorites
    const handleRemoveFromFavorites = useCallback(async (courseId) => {
        if (!user) return;

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                favoriteCourses: arrayRemove(courseId)
            });

            dispatch(removeFavorite(courseId));

            setFavoriteCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
        } catch (error) {
            console.error(error);
        } finally {
            setConfirmOpen(false);
        }
    }, [user, dispatch]);

    // joining or unjoining a course
    const handleJoinClick = useCallback((courseId, courseTitle) => {
        if (!user) {
            console.error("User is not logged in");
            return;
        }

        setCourseToJoin({ courseId, courseTitle });
        setOpenJoinDialog(true);
    }, [user]);

    const handleJoinConfirm = async () => {
        if (courseToJoin && user) {
            const { courseId } = courseToJoin;
            const userRef = doc(db, "users", user.uid);
            if (joinedCourses[courseId]) {
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
            setJoinedCourses((prevJoined) => ({
                ...prevJoined,
                [courseId]: !prevJoined[courseId],
            }));
            setSnackbarOpen(true);
        }
        setOpenJoinDialog(false);
    };

    const handleConfirmRemove = useCallback((courseId) => {
        setCourseToRemove(courseId);
        setConfirmOpen(true);
    }, []);

    const handleConfirm = useCallback(() => {
        if (courseToRemove) {
            handleRemoveFromFavorites(courseToRemove);
        }
    }, [courseToRemove, handleRemoveFromFavorites]);

    const handleClose = useCallback(() => {
        setConfirmOpen(false);
        setCourseToRemove(null);
    }, []);

    const handleJoinDialogClose = useCallback(() => {
        setOpenJoinDialog(false);
    }, []);

    const handleSnackbarClose = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    return (
        <Box>
            <Container sx={{ marginTop: 4, marginBottom: 10 }}>
                <Typography variant="h4" sx={{ marginBottom: 4, textAlign: "center", color: "#1C1E53" }}>
                    {t.Fav_Title}
                </Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <CircularProgress sx={{ color: "#1C1E53" }} />
                    </Box>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 4 }}>
                        {favoriteCourses.length > 0 ? (
                            favoriteCourses.map(course => {
                                const isJoined = joinedCourses[course.id] || false;
                                return (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        isFavorite={true}
                                        toggleFavorite={() => handleConfirmRemove(course.id)}
                                        isJoined={isJoined}
                                        toggleJoin={handleJoinClick}
                                        isFavoritePage={true}
                                    />
                                );
                            })
                        ) : (
                            <Typography variant="h6" sx={{ textAlign: "center", color: "gray" }}>
                                {t.Empty_Fav_Msg}
                            </Typography>
                        )}
                    </Box>
                )}
            </Container>

            {/* confirm dialog for removing from fav */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title= {confirmDialogT.RemoveFavTitle}
                message= {confirmDialogT.RemoveFavMsg}
                confirmText= {confirmDialogT.Confirm_Text_Fav}
                cancelText= {confirmDialogT.Cancel_Text}
            />

            {/* confirm dialog for unjoining a course */}
            <ConfirmDialog
                open={openJoinDialog}
                onClose={handleJoinDialogClose}
                onConfirm={handleJoinConfirm}
                title={joinedCourses[courseToJoin?.courseId] ? confirmDialogT.Unjoin_Course_Title : confirmDialogT.oin_Course_Title}
                message={
                    joinedCourses[courseToJoin?.courseId]
                        ? confirmDialogT.Unjoin_Course_Msg
                        : confirmDialogT.join_Course_Msg
                }
                confirmText={joinedCourses[courseToJoin?.courseId] ? confirmDialogT.Confirm_Text_Unjoin : confirmDialogT.Confirm_Text_Join}
                cancelText= {confirmDialogT.Cancel_Text}
            />

            {/* snackbar */}
            <CustomSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                onClose={handleSnackbarClose}
            />
        </Box>
    );
}

export default Favorite;