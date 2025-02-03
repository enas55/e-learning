import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/store';
import { Box, Typography, Link } from "@mui/material";

function Footer ()  {
    const dispatch = useDispatch();
        const { language, translations } = useSelector((state) => state.translation);
        const t = translations[language].footer;

        useEffect(() => {
                const savedLanguage = localStorage.getItem('appLanguage') || 'en';
                dispatch(setLanguage(savedLanguage));
            }, [dispatch]);

    return (
        <div>

        <Box
            sx={{
                backgroundColor: "#1C1E53",
                color: "white",
                padding: "40px 5%",
                width: "100%",
                boxSizing: "border-box",
                marginTop: "auto",
            }}
        >
            {/* footer main */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "20px",
                }}
            >
                {/* edufree */}
                <Box sx={{ flex: "3 3 600px", maxWidth: "500px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        {t.Title}
                    </Typography>
                    <Typography variant="body2">
                        {t.SubTitle}
                    </Typography>
                </Box>

                {/* social media */}
                <Box sx={{ flex: "1 1 200px", maxWidth: "300px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        {t.Social_Account}
                    </Typography>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        {t.Ins}
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        {t.Twitter}
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        {t.Linkedin}
                    </Link>
                </Box>

                {/* programs */}
                <Box sx={{ flex: "1 1 200px", maxWidth: "300px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        {t.Programs}
                    </Typography>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        {t.Independent_Learning}
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        {t.Finterpreneur}
                    </Link>
                </Box>

                {/* support */}
                <Box sx={{ flex: "1 1 200px", maxWidth: "300px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        {t.SUPPORT}
                    </Typography>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        {t.About_Us}
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        {t.Terms}
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        {t.Privacy_Policy}
                    </Link>
                </Box>
            </Box>

            {/* email & tele */}
            <Box
                sx={{
                    backgroundColor: "#FCE38A",
                    color: "black",
                    padding: "15px",
                    marginTop: "30px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "8px",
                }}
            >
                <Typography variant="body2">
                    <strong>{t.Email}</strong> enastaher06@gmail.com
                </Typography>
                <Typography variant="body2">
                    <strong>{t.Telephone}</strong> +201012423789
                </Typography>
            </Box>
        </Box>

        {/* copyright and nav */}
        <Box
        sx={{
            borderTop: "1px solid white",
            marginTop: "20px",
            paddingTop: "10px",
            textAlign: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            padding: "0 10%"
        }}
    >
        <Typography variant="body2" color="#1C1E53" sx={{marginTop: "10px"}}>
            {t.Copyright}
        </Typography>

        {/* bottom nav links */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "10px", }}>
            <Link href="#" color="#1C1E53">
                {t.Home}
            </Link>
            <Link href="#" color="#1C1E53">
                {t.FAQ}
            </Link>
            <Link href="#" color="#1C1E53">
                {t.Blog}
            </Link>
        </Box>
    </Box>
        </div>
    );
};

export default Footer;