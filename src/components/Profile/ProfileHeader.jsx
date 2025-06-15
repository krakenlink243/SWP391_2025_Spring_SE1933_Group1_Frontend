import React from "react";
import "./ProfileHeader.css";

const ProfileHeader = () => {
  return (
    <div className="profile-header">
      <div className="avatar-container">
        <img src={".../no-image.png"} alt="Avatar" className="avatar" />
        <div className="avatar-frame"></div>
      </div>
      <div className="profile-info">
        <h2 className="username">Lemu3n</h2>
        <p className="real-name">cinnamon roll</p>
        <div className="level-info">
          <span>Level</span>
          <span className="level">15</span>
          <div className="xp-bar">
            <div className="xp-progress" style={{ width: "75%" }}></div>
            <span>Global Sentinel</span>
            <span>500 XP</span>
          </div>
        </div>
        <button className="edit-profile-btn">Edit Profile</button>
      </div>
    </div>
  );
};

export default ProfileHeader;
