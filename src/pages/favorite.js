import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, arrayRemove} from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import CourseCard from '../components/courseCard';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

function Favorite() {
    const [favoriteCourses, setFavoriteCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchFavoriteCourses = async () => {
            if (!user) return;

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
                    }
                }
            } catch (error) {
                console.error("Error fetching favorite courses: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteCourses();
    }, [user]);

    const handleRemoveFromFavorites = async (courseId) => {
        if (!user) return;

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                favoriteCourses: arrayRemove(courseId)
            });


            setFavoriteCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
        } catch (error) {
            console.error("Error removing course from favorites: ", error);
        }
    };

    return (
        <Box>
            <Container sx={{ mt: 4, mb:10 }}>
                <Typography variant="h4" sx={{ mb: 4, textAlign: "center", color: "#1C1E53" }}>
                    Favorite Courses
                </Typography>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <CircularProgress sx={{ color: "#1C1E53" }} />
                    </Box>
                ) : (
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 4 }}>
                        {favoriteCourses.length > 0 ? (
                            favoriteCourses.map(course => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    isFavorite={true}
                                    toggleFavorite={handleRemoveFromFavorites}
                                    isFavoritePage={true}
                                />
                            ))
                        ) : (
                            <Typography variant="h6" sx={{ textAlign: "center", color: "gray" }}>
                                No favorite courses yet.
                            </Typography>
                        )}
                    </Box>
                )}
            </Container>
        </Box>
    );
}

export default Favorite;