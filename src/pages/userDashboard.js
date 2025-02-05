import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Paper } from "@mui/material";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, collection, getDocs, query, where, updateDoc, arrayRemove } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import CourseCard from "../components/courseCard";
import ConfirmDialog from "../components/confirmDialog"; 
import {useSelector } from 'react-redux';
import {useLocation } from 'react-router-dom';


function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false); 
  const [selectedCourseId, setSelectedCourseId] = useState(null); 
  const { translations, language } = useSelector((state) => state.translation);
  const ConfirmDialogT = translations[language].confirmDialog;
  const t = translations[language].userDashboard;
  const pageNameT = translations[language].pageNames;
  const location = useLocation();

    useEffect(() => {
            document.title = pageNameT.User_Dashboard_Page;
        }, [location, pageNameT]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);

            const joinedCoursesIds = data.joinedCourses || [];
            const joinedCoursesData = await fetchCoursesData(joinedCoursesIds);
            setJoinedCourses(joinedCoursesData);

          } else {
            console.error("User document not found");
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setUserData(null);
        setJoinedCourses([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchCoursesData = async (courseIds) => {
    if (courseIds.length === 0) return [];

    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, where("__name__", "in", courseIds));
    const querySnapshot = await getDocs(q);

    const coursesData = [];
    querySnapshot.forEach((doc) => {
      coursesData.push({ id: doc.id, ...doc.data() });
    });

    return coursesData;
  };

  const handleUnjoin = async (courseId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          joinedCourses: arrayRemove(courseId)
        });

        
        setJoinedCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
      }
    } catch (error) {
      console.error("Error unjoining course: ", error);
    }
  };

  const handleUnjoinClick = (courseId) => {
    setSelectedCourseId(courseId);
    setConfirmOpen(true);
  };

  const confirmUnjoin = () => {
    if (selectedCourseId) {
      handleUnjoin(selectedCourseId);
      setConfirmOpen(false);
      setSelectedCourseId(null); 
    }
  };

  
  const cancelUnjoin = () => {
    setConfirmOpen(false); 
    setSelectedCourseId(null); 
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress sx={{color: "#1C1E53"}} />
    </Box>
  );

  if (!userData) return <Typography>No user data found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 6 }}>
      {/* User Dashboard Title */}
      <Typography variant="h3" sx={{ marginBottom: 4, textAlign: "center", color: "#1C1E53", fontWeight: "bold" }}>
        {t.Main_Title}
      </Typography>

      {/* Joined Courses Section */}
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h5" fontWeight={"bold"} color="#1C1E53" sx={{ marginBottom: 3 }}>
          {t.Joined_Title}
        </Typography>

        {/* Using Box with Flexbox */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          justifyContent: 'start' ,
          marginBottom: 4
        }}>
          {joinedCourses.length > 0 ? (
            joinedCourses.map((course) => (
              <Box key={course.id} sx={{ 
                flex: '1 1 30%', 
                maxWidth: '300px', 
                minWidth: '250px' 
              }}>
                <CourseCard
                  course={course}
                  isJoined={true}
                  toggleJoin={() => handleUnjoinClick(course.id)} 
                  isFavoritePage={false}
                  isDashboardPage={true}
                />
              </Box>
            ))
          ) : (
            <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center", width: "100%" }}>
              No joined courses yet.
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={cancelUnjoin}
        onConfirm={confirmUnjoin}
        title={ConfirmDialogT.Unjoin_Course_Title}
        message= {ConfirmDialogT.Unjoin_Course_Msg}
        confirmText= {ConfirmDialogT.Confirm_Text_Unjoin}
        cancelText= {ConfirmDialogT.Cancel_Text}
      />
    </Container>
  );
}

export default UserDashboard;