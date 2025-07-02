import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GameShowcase from "./GameShowCase";
import "./ProfilePage.css";
import { useOnlineUsers } from "../../utils/OnlineUsersContext";

// Tách ProfileHeader ra để dễ quản lý
const ProfileHeader = ({ user, onEditClick }) => {
  const avatarUrl =
    user?.avatarUrl ||
    "https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg";
  const isOnline = useOnlineUsers; // Giả sử API trả về trạng thái online

  return (
    <div className="profile-header">
      <div className="profile-info-container">
        <div className="profile-left-info">
          <div className="profile-avatar-section">
            <img src={avatarUrl} alt="User Avatar" className="main-avatar" />
            <div
              className={`status-indicator ${isOnline ? "online" : "offline"}`}
            ></div>
          </div>
          <div className="profile-details-header">
            <h1 className="username">
              {user?.profileName || user?.username || "Anonymous User"}
            </h1>
            <p className="country">{user?.country || "Location not set"}</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="action-btn primary" onClick={onEditClick}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User ID not found in localStorage. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/user/profile/${userId}`
        );
        setProfileData(response.data);
      } catch (err) {
        setError("Could not fetch profile data. The user may not exist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Dependency rỗng để chỉ chạy 1 lần

  const handleEditRedirect = () => {
    if (profileData?.userId) {
      navigate(`/profile/${profileData.userId}/edit/info`);
    }
  };

  if (loading)
    return <div className="profile-page-status">Loading Profile...</div>;
  if (error) return <div className="profile-page-status error">{error}</div>;
  if (!profileData)
    return <div className="profile-page-status">Profile not found.</div>;

  return (
    <div className="profile-page">
      <div className="dynamic-background">
        <video src="/videos/Sequence 01.mp4" autoPlay loop muted></video>
      </div>
      <div className="profile-content">
        <ProfileHeader user={profileData} onEditClick={handleEditRedirect} />

        <div className="profile-main">
          {/* === CỘT TRÁI === */}
          <div className="profile-left">
            <GameShowcase
              userId={profileData.userId}
              gameCount={profileData.totalGames || 0}
            />
            <div className="profile-bio section-box">
              <h3>Bio</h3>
              <p>
                {profileData.summary ||
                  "This user has not written a summary yet."}
              </p>
            </div>
          </div>

          {/* === CỘT PHẢI === */}
          <div className="profile-right">
            <div className="profile-details section-box">
              <ul className="details-list">
                <li>
                  Games <span>{profileData.totalGames ?? "N/A"}</span>
                </li>
                <li>
                  Reviews <span>{profileData.reviewCount ?? "N/A"}</span>
                </li>
                <li>Inventory</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
