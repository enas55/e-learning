import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/store';
import { useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {
    Container,
    Box,
    Typography,
    Pagination,
    Button,
    Menu,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from "@mui/material";
import CourseCard from "../components/courseCard";
import CustomSnackbar from "../components/snackbarComponent";
import ConfirmDialog from "../components/confirmDialog";


function AllCourses() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage] = useState(6);
    const [anchorEl, setAnchorEl] = useState(null);
    const [priceFilter, setPriceFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [favorites, setFavorites] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openFavoriteDialog, setOpenFavoriteDialog] = useState(false);
    const [courseToRemoveFromFavorites, setCourseToRemoveFromFavorites] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [courseToJoin, setCourseToJoin] = useState(null);
    const [joinedCourses, setJoinedCourses] = useState({});
    const [openJoinDialog, setOpenJoinDialog] = useState(false);
    const dispatch = useDispatch();
    const { language, translations } = useSelector((state) => state.translation);
    const t = translations[language].confirmDialog;
    const filterAndTitleT = translations[language].filterAndMainTiltles;

    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage') || 'en';
        dispatch(setLanguage(savedLanguage));
    }, [dispatch]);

    useEffect(() => {
        document.title = "All Courses";
    }, [location]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "courses"));
                const coursesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCourses(coursesData);
                setFilteredCourses(coursesData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // toggle fav
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


    // filter part
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const applyFilters = () => {
        let filtered = courses;

        if (priceFilter === "lowToHigh") {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (priceFilter === "highToLow") {
            filtered = filtered.sort((a, b) => b.price - a.price);
        }

        if (categoryFilter) {
            filtered = filtered.filter((course) =>
                course.category.includes(categoryFilter)
            );
        }

        setFilteredCourses(filtered);
        setCurrentPage(1);
        handleFilterClose();
    };

    const resetFilters = () => {
        setPriceFilter("");
        setCategoryFilter("");
        setFilteredCourses(courses);
        setCurrentPage(1);
        handleFilterClose();
    };

    // pagination 
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(
        indexOfFirstCourse,
        indexOfLastCourse
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const uniqueCategories = Array.from(
        new Set(courses.flatMap((course) => course.category))
    );

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
        <div>
            
            <Container sx={{ mt: 4, mb: 4 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <CircularProgress sx={{ color: "#1C1E53" }} />
                    </Box>
                ) : (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                                color: "#1C1E53",
                            }}
                        >
                            <Typography variant="h4" gutterBottom textAlign="start">
                                {filterAndTitleT.All_Courses_Title}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleFilterClick}
                                sx={{
                                    backgroundColor: "#1C1E53",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#1C1E53",
                                    },
                                }}
                            >
                                {filterAndTitleT.Filter_Title}
                            </Button>
                        </Box>

                        {/* filter menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleFilterClose}
                        >
                            <Box sx={{ p: 2, minWidth: 200 }}>
                                <Typography variant="h6" sx={{ color: "#1C1E53" }}>
                                    {filterAndTitleT.Filter_By}
                                </Typography>
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel
                                        sx={{
                                            color: "#1C1E53",
                                            "&.Mui-focused": {
                                                color: "#1C1E53",
                                            },
                                        }}
                                    >
                                        {filterAndTitleT.Filter_Price}
                                    </InputLabel>
                                    <Select
                                        value={priceFilter}
                                        onChange={(e) => setPriceFilter(e.target.value)}
                                        label="Price"
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#1C1E53",
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#1C1E53",
                                            },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#1C1E53",
                                            },
                                        }}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value="lowToHigh">{filterAndTitleT.Low_To_High_Text}</MenuItem>
                                        <MenuItem value="highToLow">{filterAndTitleT.High_To_High_Text}</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel
                                        sx={{
                                            color: "#1C1E53",
                                            "&.Mui-focused": {
                                                color: "#1C1E53",
                                            },
                                        }}
                                    >
                                        {filterAndTitleT.Category}
                                    </InputLabel>
                                    <Select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        label="Category"
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#1C1E53",
                                            },
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#1C1E53",
                                            },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "#1C1E53",
                                            },
                                        }}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        {uniqueCategories.map((cat, index) => (
                                            <MenuItem key={index} value={cat}>
                                                {cat}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={applyFilters}
                                        sx={{
                                            backgroundColor: "#1C1E53",
                                            color: "white",
                                        }}
                                    >
                                        {filterAndTitleT.Apply}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={resetFilters}
                                        sx={{
                                            borderColor: "#1C1E53",
                                            color: "#1C1E53",
                                        }}
                                    >
                                        {filterAndTitleT.Reset}
                                    </Button>
                                </Box>
                            </Box>
                        </Menu>

                        {/* display filtered courses */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: 4,
                            }}
                        >
                            {currentCourses.map((course) => {
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
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <Pagination
                                count={Math.ceil(filteredCourses.length / coursesPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
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

            

            {/* fav confirm dialog */}
            <ConfirmDialog
                open={openFavoriteDialog}
                onClose={() => setOpenFavoriteDialog(false)}
                onConfirm={handleRemoveFromFavorites}
                title={t.RemoveFavTitle}
                message={t.RemoveFavMsg}
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
                title={joinedCourses[courseToJoin?.courseId] ? t.Unjoin_Course_Title : t.oin_Course_Title}
                message={
                    joinedCourses[courseToJoin?.courseId]
                        ? t.Unjoin_Course_Msg
                        : t.join_Course_Msg
                }
                confirmText={joinedCourses[courseToJoin?.courseId] ? t.Confirm_Text_Unjoin : t.Confirm_Text_Join}
                cancelText={t.Cancel_Text}
            />

        </div>
    );
}

export default AllCourses;