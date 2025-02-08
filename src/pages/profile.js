import React from "react";
import "./profile.css";
import ProfileCard from "../components/profileCard";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="profile">
      <div className="profile-container">

        {/* Flex container for profile and experience */}
        <div className="profile-layout">

          {/* Profile Card */}
          <ProfileCard
            user={{
              name: " Omar Ahmed",
              role: "Front-End Developer",
              bio: "Passionate about learning and coding.",
              image: "https://i.pravatar.cc/150?img=3" // Placeholder image
            }}
          />

          {/* Experience and Work Section */}
          <div className="profile-details">

            {/* Work Preferences */}
            <Box className="work-preferences">
              <ion-icon name="create-outline"></ion-icon>
              <h2>Work Preferences</h2>
              <h5>
                <ion-icon name="person-outline"></ion-icon>
                Front End Developer
              </h5>
            </Box>

            {/* Additional Info */}
            <Box className="info">
              <ion-icon name="create-outline"></ion-icon>
              <h2>Additional Info</h2>
              <p>
                Help recruiters get to know you better by describing what makes
                you a great candidate and sharing other links.
              </p>
              <Link className="add-info">
                <ion-icon name="add-outline"></ion-icon> Add Additional Info
              </Link>
            </Box>

            {/* Experience */}
            <Box className="experience">
              <h2>
                Projects <ion-icon name="alert-outline"></ion-icon>
              </h2>
              <p>
                Showcase your skills to recruiters with job-relevant projects.
                Add projects here to demonstrate your technical expertise and
                ability to solve real-world problems.
                <Link className="project">Browse projects</Link>
              </p>
            </Box>

            {/* Work History */}
            <Box className="work">
              <h2>Work History</h2>
              <p>
                Add your past work experience here. If you’re just starting out,
                you can add internships or volunteer experience instead.
                <Link className="add-info">
                  <ion-icon name="add-outline"></ion-icon> Add Work History
                </Link>
              </p>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
