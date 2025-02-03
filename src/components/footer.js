import React from "react";
import { Box, Typography, Link } from "@mui/material";

function Footer ()  {
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
                        EDUFREE
                    </Typography>
                    <Typography variant="body2">
                        Build and achieve your dreams with Edufree
                    </Typography>
                </Box>

                {/* social media */}
                <Box sx={{ flex: "1 1 200px", maxWidth: "300px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        Social Media
                    </Typography>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        Instagram
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        Twitter
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        LinkedIn
                    </Link>
                </Box>

                {/* programs */}
                <Box sx={{ flex: "1 1 200px", maxWidth: "300px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        Programs
                    </Typography>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        Independent Learning
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        Finterpreneur
                    </Link>
                </Box>

                {/* support */}
                <Box sx={{ flex: "1 1 200px", maxWidth: "300px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        SUPPORT
                    </Typography>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        About Us
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        Terms
                    </Link>
                    <Link href="#" color="inherit" sx={{ display: "block", marginBottom: "8px" }}>
                        Privacy Policy
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
                    <strong>Email:</strong> enastaher06@gmail.com
                </Typography>
                <Typography variant="body2">
                    <strong>Telephone:</strong> +201012423789
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
            © Copyright EDUFREE 2021 - 2022
        </Typography>

        {/* bottom nav links */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "10px", }}>
            <Link href="#" color="#1C1E53">
                Home
            </Link>
            <Link href="#" color="#1C1E53">
                FAQ
            </Link>
            <Link href="#" color="#1C1E53">
                Blog
            </Link>
        </Box>
    </Box>
        </div>
    );
};

export default Footer;