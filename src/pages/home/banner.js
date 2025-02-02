import React from "react";
import { Box, Typography, Container } from "@mui/material";
import BannerImage from "../../assets/images/Illustration.png";
import Image1 from "../../assets/images/Group 2618.png";
import Image2 from "../../assets/images/Group 2535.png";

const Banner = () => {
    return (
        <Box
            sx={{
                backgroundColor: "#1C1E53",
                color: "white",
                py: 6,
                px: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: { xs: "column", md: "row" },
                position: "relative",
            }}
        >
            <Container
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    gap: 4,
                    position: "relative",
                }}
            >
                {/* left */}
                <Box
                    sx={{
                        flex: 1,
                        textAlign: { xs: "center", md: "left" },
                    }}
                >
                    <Typography variant="h3" gutterBottom>
                        Build and Achieve Your Dreams with EDUFREE
                    </Typography>
                    <Typography variant="h6" sx={{ maxWidth: "600px", mb: 3 }}>
                        EDUFREE is a free online course and training service designed to help you achieve your dreams in the field of technology.
                    </Typography>
                </Box>

                {/* right */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                        position: "relative",
                    }}
                >
                    {/* main img */}
                    <img
                        src={BannerImage}
                        alt="Banner"
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            borderRadius: "8px",
                        }}
                    />

                    {/* first img */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: { xs: "-20px", md: "-30px" },
                            left: { xs: "-20px", md: "-40px" },
                            zIndex: 1,
                        }}
                    >
                        <img
                            src={Image2}
                            alt="Decoration 1"
                            style={{
                                width: { xs: "80px", md: "120px" },
                                height: "auto",
                                borderRadius: "8px",
                            }}
                        />
                    </Box>

                    {/* sec img */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: { xs: "-20px", md: "-30px" },
                            right: { xs: "-20px", md: "-40px" }, 
                            zIndex: 1,
                        }}
                    >
                        <img
                            src={Image1}
                            alt="Decoration 2"
                            style={{
                                width: { xs: "80px", md: "120px" },
                                height: "auto",
                                borderRadius: "8px",
                            }}
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Banner;