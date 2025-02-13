import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setFavorites, addFavorite, removeFavorite } from '../redux/store';
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
    TextField
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
    const snackbarT = translations[language].snackbar;
    const pageNameT = translations[language].pageNames;
    const searchT = translations[language].navbar;
    const [userId, setUserId] = useState(null);
    const favoriteCourses = useSelector((state) => state.favorites.favoriteCourses);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

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
                loadFavorites(user.uid);
                loadJoinedCourses(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, [loadFavorites]);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('appLanguage') || 'en';
        dispatch(setLanguage(savedLanguage));
    }, [dispatch]);

    useEffect(() => {
        document.title = pageNameT.All_Courses;
    }, [location, pageNameT]);

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

    const loadJoinedCourses = async (userId) => {
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
    };

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
                language === "en" ? course.category.includes(categoryFilter) : course.catAr.includes(categoryFilter)
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

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(
        indexOfFirstCourse,
        indexOfLastCourse
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const uniqueCategories = Array.from(new Set(courses.flatMap((course) => language === "en" ? course.category : course.catAr || [])));


    useEffect(() => {
        const searchCourses = () => {
            if (searchTerm) {
                const filtered = courses.filter((course) =>
                    course.title.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredCourses(filtered);
            } else {
                setFilteredCourses(courses);
            }
        };

        searchCourses();
    }, [searchTerm, courses]);

    return (
        <div>
            <Container sx={{ mt: 4, mb: 4 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <CircularProgress sx={{ color: "#1C1E53" }} />
                    </Box>
                ) : (
                    <>
                        {/* search */}
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 4, direction: language === "en" ? "ltr" : "rtl" }}>
                            <TextField
                                label= {searchT.Search_label}
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    width: "50%",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#1C1E53",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#1C1E53",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#1C1E53",
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: "#1C1E53",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#1C1E53",
                                    },
                                }}
                            />
                        </Box>
                        

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                                color: "#1C1E53",
                                direction: language === "en" ? "ltr" : "rtl",
                                padding: 2
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
                                        <MenuItem value="">{language === "en" ? "None" : "لا شئ"}</MenuItem>
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
                                        label={language === "en" ? "Category" : "catAr"}
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
                                        <MenuItem value="">{language === "en" ? "None" : "لا شئ"}</MenuItem>
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

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: 4,
                            }}
                        >
                            {filteredCourses.length === 0 && (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                                <Typography variant="h6" sx={{ color: "#1C1E53" }}>
                                    {searchT.No_Result_Found_Msg}
                                </Typography>
                            </Box>
                        )}
                            {currentCourses.map((course) => {
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
                        <br />
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
        </div>
    );
}

export default AllCourses;