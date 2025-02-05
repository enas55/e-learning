import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

function Layout() {
    return (
        <div sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <div>
                <Outlet/>
            </div>
            <Footer />
        </div>
    );
}

export default Layout;
