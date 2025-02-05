import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setFavorites, addFavorite, removeFavorite } from '../../redux/store';
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase/firebaseConfig";
import { Container, Box, Typography, Pagination, IconButton, Chip, Modal, CircularProgress } from "@mui/material";
import CourseCard from "../../components/courseCard";
import CustomSnackbar from "../../components/snackbarComponent";
import ConfirmDialog from "../../components/confirmDialog";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Banner from "./banner";
import CloseIcon from "@mui/icons-material/Close";

function Home() {
    const [courses, setCourses] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openFavoriteDialog, setOpenFavoriteDialog] = useState(false);
    const [courseToRemoveFromFavorites, setCourseToRemoveFromFavorites] = useState(null);
    const [currentPopularPage, setCurrentPopularPage] = useState(1);
    const [popularCoursesPerPage] = useState(6);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryCourses, setCategoryCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [courseToJoin, setCourseToJoin] = useState(null);
    const [joinedCourses, setJoinedCourses] = useState({});
    const [openJoinDialog, setOpenJoinDialog] = useState(false);
    const dispatch = useDispatch();
    const { language, translations } = useSelector((state) => state.translation);
    const t = translations[language].confirmDialog;
    const titleT = translations[language].filterAndMainTiltles;
    const snackbarT = translations[language].snackbar;
    const pageNameT = translations[language].pageNames;
    const [userId, setUserId] = useState(null);
    const favoriteCourses = useSelector((state) => state.favorites.favoriteCourses);
    const navigate = useNavigate();

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

    const loadJoinedCourses = useCallback(async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
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
            console.error("Error loading joined courses:", error);
        }
    }, []);


    
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                loadFavorites(user.uid);
                loadJoinedCourses(user.uid);
            } else {
                setUserId(null);
                setJoinedCourses({});
                dispatch(setFavorites([]));
            }
        });

        return () => unsubscribe();
    }, [loadFavorites, loadJoinedCourses, dispatch]);

    
    // lang fun
    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage') || 'en';
        dispatch(setLanguage(savedLanguage));
    }, [dispatch]);


    //  page title
    useEffect(() => {
        document.title = pageNameT.Home_Page;
    }, [location, pageNameT]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "courses"));
                const coursesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    title: doc.data().title,
                }));
                setCourses(coursesData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleJoinClick = async (courseId, courseTitle) => {
        if (!userId) {
            navigate("/auth");
            return;
        }

        setCourseToJoin({ courseId, courseTitle });
        setOpenJoinDialog(true);
    };

    const handleJoinConfirm = async () => {
        if (courseToJoin) {
            const { courseId } = courseToJoin;
            const userRef = doc(db, "users", userId);
            if (joinedCourses[courseId]) {
                await updateDoc(userRef, {
                    joinedCourses: arrayRemove(courseId)
                });
            } else {
                await updateDoc(userRef, {
                    joinedCourses: arrayUnion(courseId)
                });
            }
            setJoinedCourses((prevJoined) => ({
                ...prevJoined,
                [courseId]: !prevJoined[courseId],
            }));
            setSnackbarMessage(
                joinedCourses[courseId]
                    ? snackbarT.Snackbar_Unjoined_Courses
                    : snackbarT.Snackbar_Joined_Courses
            );
            setOpenSnackbar(true);
        }
        setOpenJoinDialog(false);
    };

    const popularCourses = courses.filter((course) => course.isPopular);
    const indexOfLastPopularCourse = currentPopularPage * popularCoursesPerPage;
    const indexOfFirstPopularCourse = indexOfLastPopularCourse - popularCoursesPerPage;
    const currentPopularCourses = popularCourses.slice(indexOfFirstPopularCourse, indexOfLastPopularCourse);

    const handlePopularPageChange = (event, value) => {
        setCurrentPopularPage(value);
    };

    const CustomPrevArrow = (props) => {
        const { onClick } = props;
        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: "absolute",
                    left: -40,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    backgroundColor: "transparent",
                    color: "#1C1E53",
                    "@media (max-width: 1024px)": {
                        left: -30,
                    },
                    "@media (max-width: 600px)": {
                        left: -20,
                    },
                }}
            >
                <ArrowBackIosIcon />
            </IconButton>
        );
    };

    const CustomNextArrow = (props) => {
        const { onClick } = props;
        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: "absolute",
                    right: -30,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    backgroundColor: "transparent",
                    color: "#1C1E53",
                    "@media (max-width: 1024px)": {
                        right: -20,
                    },
                    "@media (max-width: 600px)": {
                        right: -10,
                    },
                }}
            >
                <ArrowForwardIosIcon />
            </IconButton>
        );
    };

    const carouselSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };


    // cat part
    const uniqueCategories = Array.from(new Set(courses.flatMap((course) => course.category)));

    const handleCategoryClick = (category) => {
        const filtered = courses.filter((course) => course.category.includes(category));
        setCategoryCourses(filtered);
        setSelectedCategory(category);
        setOpenCategoryModal(true);
    };


    // fav part
    const toggleFavorite = async (courseId, courseTitle) => {
        if (!userId) {
            navigate("/auth");
            return;
        }

        if (favoriteCourses.includes(courseId)) {
            setCourseToRemoveFromFavorites({ courseId, courseTitle });
            setOpenFavoriteDialog(true);
        } else {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                favoriteCourses: arrayUnion(courseId)
            });
            dispatch(addFavorite(courseId));
            setSnackbarMessage(snackbarT.Snackbar_Added_to_Fav);
            setOpenSnackbar(true);
            await loadFavorites(userId);
        }
    };

    const handleRemoveFromFavorites = async () => {
        if (courseToRemoveFromFavorites) {
            const { courseId } = courseToRemoveFromFavorites;
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                favoriteCourses: arrayRemove(courseId)
            });
            dispatch(removeFavorite(courseId));
            setSnackbarMessage(snackbarT.Snackbar_Remove_From_Fav);
            setOpenSnackbar(true);
            await loadFavorites(userId);
        }
        setOpenFavoriteDialog(false);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Banner />
            <Container sx={{ mt: 4, flex: 1 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <CircularProgress sx={{ color: "#1C1E53" }} />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 4, position: "relative" }}>
                            <Slider {...carouselSettings}>
                                {uniqueCategories.map((category, index) => (
                                    <Box key={index} sx={{ textAlign: "center", margin: "0px 5px" }}>
                                        <Chip
                                            label={category}
                                            onClick={() => handleCategoryClick(category)}
                                            sx={{
                                                m: 0,
                                                p: 1,
                                                borderRadius: "20px",
                                                backgroundColor: "#1C1E53",
                                                color: "white",
                                                "&:hover": {
                                                    backgroundColor: "#1C1E53",
                                                },
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Slider>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, color: "#1C1E53" }}>
                            <Typography variant="h4" gutterBottom textAlign="start">
                                {titleT.Popular_Courses_Title}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: 4,
                                mb: 4,
                            }}
                        >
                            {currentPopularCourses.map((course) => {
                                const isFavorite = favoriteCourses.includes(course.id);
                                const isJoined = joinedCourses[course.id] || false;

                                return (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        isFavorite={isFavorite}
                                        toggleFavorite={toggleFavorite}
                                        isJoined={isJoined}
                                        toggleJoin={handleJoinClick}
                                    />
                                );
                            })}
                        </Box>
                        <br/>
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 4}}>
                            <Pagination
                                count={Math.ceil(popularCourses.length / 6)}
                                page={currentPopularPage}
                                onChange={handlePopularPageChange}
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        color: "#1C1E53",
                                    },
                                    "& .MuiPaginationItem-previousNext": {
                                        color: "#1C1E53",
                                    },
                                    "& .MuiPaginationItem-root.Mui-selected": {
                                        backgroundColor: "#1C1E53",
                                        color: "white",
                                    },
                                }}
                            />
                        </Box>
                    </>
                )}
            </Container>

            <Modal
                open={openCategoryModal}
                onClose={() => setOpenCategoryModal(false)}
                aria-labelledby="category-modal-title"
                aria-describedby="category-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        maxWidth: 800,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenCategoryModal(false)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: "#1C1E53",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography id="category-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Courses in {selectedCategory}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: 4,
                            maxHeight: "60vh",
                            overflowY: "auto",
                        }}
                    >
                        {categoryCourses.map((course) => {
                            const isFavorite = favoriteCourses.includes(course.id);
                            const isJoined = joinedCourses[course.id] || false;

                            return (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    isFavorite={isFavorite}
                                    toggleFavorite={toggleFavorite}
                                    isJoined={isJoined}
                                    toggleJoin={handleJoinClick}
                                />
                            );
                        })}
                    </Box>
                </Box>
            </Modal>

            <ConfirmDialog
                open={openFavoriteDialog}
                onClose={() => setOpenFavoriteDialog(false)}
                onConfirm={handleRemoveFromFavorites}
                title={t.RemoveFavTitle}
                message={t.RemoveFavMsg}
                confirmText={t.Confirm_Text_Fav}
                cancelText={t.Cancel_Text}
            />

            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                onClose={() => setOpenSnackbar(false)}
            />

            <ConfirmDialog
                open={openJoinDialog}
                onClose={() => setOpenJoinDialog(false)}
                onConfirm={handleJoinConfirm}
                title={joinedCourses[courseToJoin?.courseId] ? t.Unjoin_Course_Title : t.Join_Course_Title}
                message={
                    joinedCourses[courseToJoin?.courseId]
                        ? t.Unjoin_Course_Msg
                        : t.join_Course_Msg
                }
                confirmText={joinedCourses[courseToJoin?.courseId] ? t.Confirm_Text_Unjoin : t.Confirm_Text_Join}
                cancelText={t.Cancel_Text}
            />
        </Box>
    );
}

export default Home;