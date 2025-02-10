import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Avatar,
    CircularProgress,
    Paper,
    Box,
    Divider
} from "@mui/material";

function Profile() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const { translations, language } = useSelector((state) => state.translation);
    const t = translations[language].profile;
    const pageNameT = translations[language].pageNames;
    const location = useLocation();

    useEffect(() => {
        document.title = pageNameT.Profile_Page;
    }, [location, pageNameT]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                await fetchUserData(currentUser.uid);
            } else {
                setUser(null);
                setRole("");
                setName("");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchUserData = async (userId) => {
        try {
            const userDocRef = doc(db, "users", userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                setRole(userDoc.data().role || "User");
                setName(userDoc.data().name || "User");
            } else {
                setRole("User");
                setName("User");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setRole("User");
            setName("User");
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ textAlign: "center", mt: 6 }}>
                <CircularProgress size={50} sx={{ color: "#1C1E53", p: 4 }} />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
            <Typography variant="h4" sx={{ color: "#1C1E53", textAlign: "center", mb: 2 }}>
                {t.Profile_Title}
            </Typography>

            <Paper elevation={3} sx={{ p: 4, borderRadius: "15px" }}>
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", md: "row" }}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ gap: 4 }}
                >
                    <Avatar
                        src={"https://via.placeholder.com/150"}
                        sx={{
                            width: { xs: 120, sm: 140, md: 150 },
                            height: { xs: 120, sm: 140, md: 150 },
                            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                            mb: { xs: 2, md: 0 }
                        }}
                    />

                    <Card sx={{ flex: 1, borderRadius: "10px", bgcolor: "#whiteSmoke", width: "100%" }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ color: "#1C1E53", }}>
                                {t.Username} {name}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1" sx={{ color: "#1C1E53", }}>
                                {t.Email} {user.email}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#1C1E53", }}>
                                {t.Role} {role}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Paper>
        </Container>
    );
}

export default Profile;
