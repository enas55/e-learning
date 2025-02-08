import React from "react";
import "./profilecard.css";
import { Link } from "react-router-dom";
function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <img src={user.image} alt={user.name} className="profile-image" />
      </div>
      <div className="profile-body">
      <Link className="create">
          <ion-icon name="create-outline"></ion-icon>
      </Link>
        <h3 className="profile-name">{user.name}</h3>
        <p className="profile-role">{user.role}</p>
        <p className="profile-bio">{user.bio}</p>
               <Link className="share">
                <ion-icon name="share-social-outline"></ion-icon>
                  Share profile link
                </Link>
                <Link className="update">
                  Update profile visibility
                </Link>

      </div>
    </div>
  );
}

export default ProfileCard;
