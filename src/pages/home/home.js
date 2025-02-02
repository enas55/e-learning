import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import ResponsiveAppBar from "./navbar";
import { Container, Box, Typography, Pagination, Button, IconButton, Chip, Modal } from "@mui/material";
import CourseCard from "../../components/courseCard";
import CustomSnackbar from "../../components/snackbarComponent";
import ConfirmDialog from "../../components/confirmDialog";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Banner from "./banner";

function Home() {
    const [courses, setCourses] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [cartItems, setCartItems] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [openFavoriteDialog, setOpenFavoriteDialog] = useState(false);
    const [courseToRemoveFromFavorites, setCourseToRemoveFromFavorites] = useState(null);
    const [currentPopularPage, setCurrentPopularPage] = useState(1);
    const [popularCoursesPerPage] = useState(6);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoryCourses, setCategoryCourses] = useState([]);

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
            }
        };

        fetchCourses();
    }, []);

    // add to cart
    const handleCartToggle = (courseId, courseTitle) => {
        if (cartItems[courseId]) {
            setSelectedCourse({ courseId, courseTitle });
            setOpenDialog(true);
        } else {
            setCartItems((prevCart) => ({
                ...prevCart,
                [courseId]: true,
            }));
            setSnackbarMessage(`${courseTitle} has been added to your cart!`);
            setOpenSnackbar(true);
        }
    };

    // remove from cart
    const handleRemoveFromCart = () => {
        if (selectedCourse) {
            const { courseId, courseTitle } = selectedCourse;
            setCartItems((prevCart) => {
                const updatedCart = { ...prevCart };
                delete updatedCart[courseId];
                return updatedCart;
            });
            setSnackbarMessage(`${courseTitle} has been removed from your cart.`);
            setOpenSnackbar(true);
        }
        setOpenDialog(false);
    };

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

    return (
        <div>
            <ResponsiveAppBar />
            <Banner />
            <Container sx={{ mt: 4 }}>
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
                        const isInCart = cartItems[course.id] || false;

                        return (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isFavorite={isFavorite}
                                isInCart={isInCart}
                                toggleFavorite={toggleFavorite}
                                handleCartToggle={handleCartToggle}
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
            </Container>

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
                            const isInCart = cartItems[course.id] || false;

                            return (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    isFavorite={isFavorite}
                                    isInCart={isInCart}
                                    toggleFavorite={toggleFavorite}
                                    handleCartToggle={handleCartToggle}
                                />
                            );
                        })}
                    </Box>
                    <Button
                        variant="contained"
                        onClick={() => setOpenCategoryModal(false)}
                        sx={{ mt: 2, backgroundColor: "#1C1E53" }}
                    >
                        Close
                    </Button>
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

            {/* cart confirm dialog */}
            <ConfirmDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleRemoveFromCart}
                title="Remove Course"
                message={`Are you sure you want to remove ${selectedCourse?.courseTitle} from your cart?`}
            />
        </div>
    );
}

export default Home;