import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, icon, path }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path);
    };

    return (
        <Card
            sx={{
                textAlign: "center",
                padding: 4,
                boxShadow: 3,
                borderRadius: 2,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
                color: "#1C1E53",
            }}
            onClick={handleClick}
        >
            <CardContent>
                <Box sx={{ color: "#1C1E53", marginBottom: 1 }}>{icon}</Box>
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default DashboardCard;