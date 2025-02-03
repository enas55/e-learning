import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import ResponsiveAppBar from "../../components/navbar";
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
import Footer from "../../components/footer";
import CloseIcon from "@mui/icons-material/Close";

function Home() {
    const [courses, setCourses] = useState([]);
    const [favorites, setFavorites] = useState({});
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

    useEffect(() => {
        document.title = "Home";
    }, [location]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "courses"));
                const coursesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    title: doc.data().title || "Title not found",
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

    // course filter
    const popularCourses = courses.filter((course) => course.isPopular);
    const indexOfLastPopularCourse = currentPopularPage * popularCoursesPerPage;
    const indexOfFirstPopularCourse = indexOfLastPopularCourse - popularCoursesPerPage;
    const currentPopularCourses = popularCourses.slice(indexOfFirstPopularCourse, indexOfLastPopularCourse);

    const handlePopularPageChange = (event, value) => {
        setCurrentPopularPage(value);
    };

    // previous arrow for carousel
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

    // next arrow for carousel
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

    // carousel settings
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

    // Category handling
    const uniqueCategories = Array.from(new Set(courses.flatMap((course) => course.category)));

    const handleCategoryClick = (category) => {
        const filtered = courses.filter((course) => course.category.includes(category));
        setCategoryCourses(filtered);
        setSelectedCategory(category);
        setOpenCategoryModal(true);
    };

    // favorite handling
    const toggleFavorite = (courseId, courseTitle) => {
        if (favorites[courseId]) {
            setCourseToRemoveFromFavorites({ courseId, courseTitle });
            setOpenFavoriteDialog(true);
        } else {
            setFavorites((prevFavorites) => ({
                ...prevFavorites,
                [courseId]: true,
            }));
            setSnackbarMessage(`${courseTitle} has been added to your favorites`);
            setOpenSnackbar(true);
        }
    };

    const handleRemoveFromFavorites = () => {
        if (courseToRemoveFromFavorites) {
            const { courseId, courseTitle } = courseToRemoveFromFavorites;
            setFavorites((prevFavorites) => {
                const updatedFavorites = { ...prevFavorites };
                delete updatedFavorites[courseId];
                return updatedFavorites;
            });
            setSnackbarMessage(`${courseTitle} has been removed from your favorites`);
            setOpenSnackbar(true);
        }
        setOpenFavoriteDialog(false);
    };

    // handle toggle join
    const handleJoinClick = (courseId, courseTitle) => {
        setCourseToJoin({ courseId, courseTitle });
        setOpenJoinDialog(true);
    };

    const handleJoinConfirm = () => {
        if (courseToJoin) {
            const { courseId, courseTitle } = courseToJoin;
            setJoinedCourses((prevJoined) => ({
                ...prevJoined,
                [courseId]: !prevJoined[courseId],
            }));
            setSnackbarMessage(
                joinedCourses[courseId]
                    ? `You have unjoined ${courseTitle}`
                    : `You have joined ${courseTitle}`
            );
            setOpenSnackbar(true);
        }
        setOpenJoinDialog(false);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <ResponsiveAppBar />
            <Banner />
            <Container sx={{ mt: 4, flex: 1 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <CircularProgress sx={{ color: "#1C1E53" }} />
                    </Box>
                ) : (
                    <>
                        {/* cat carousel */}
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

                        {/* popular courses */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, color: "#1C1E53" }}>
                            <Typography variant="h4" gutterBottom textAlign="start">
                                Popular Courses
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
                                const isFavorite = favorites[course.id] || false;
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

                        {/* pagination */}
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
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

            {/* footer */}
            <Footer />

            {/* cat modal */}
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
        {/* إضافة أيقونة الإغلاق في الزاوية اليمنى العليا */}
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
                const isFavorite = favorites[course.id] || false;
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

            {/* fav confirm dialog */}
            <ConfirmDialog
                open={openFavoriteDialog}
                onClose={() => setOpenFavoriteDialog(false)}
                onConfirm={handleRemoveFromFavorites}
                title="Remove from Favorites"
                message={`Are you sure you want to remove ${courseToRemoveFromFavorites?.courseTitle} from your favorites?`}
            />

            {/* snackbar */}
            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                onClose={() => setOpenSnackbar(false)}
            />

            {/* toggle join confirm dialog */}
            <ConfirmDialog
                open={openJoinDialog}
                onClose={() => setOpenJoinDialog(false)}
                onConfirm={handleJoinConfirm}
                title={joinedCourses[courseToJoin?.courseId] ? "Unjoin Course" : "Join Course"}
                message={
                    joinedCourses[courseToJoin?.courseId]
                        ? `Are you sure you want to unjoin ${courseToJoin?.courseTitle}?`
                        : `Are you sure you want to join ${courseToJoin?.courseTitle}?`
                }
                confirmText={joinedCourses[courseToJoin?.courseId] ? "Unjoin" : "Join"}
                cancelText="Cancel"
            />
        </Box>
    );
}

export default Home;