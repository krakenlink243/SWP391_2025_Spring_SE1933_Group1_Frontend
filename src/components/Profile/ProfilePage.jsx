import React from "react";
import "./ProfilePage.css";
import { Link, useNavigate } from "react-router-dom";
import GameShowcase from "./GameShowCase";
import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
// import particleConfig from "./particles.json";
import { useState, useEffect } from "react";
import axios from "axios";

import { useOnlineUsers } from "../../utils/OnlineUsersContext"; // Added by Phan Son 29-06

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onlineUsers = useOnlineUsers(); // Added by Phan Son 29-06

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      // Lấy userId từ localStorage ngay bên trong effect
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
        console.log(response.data);
      } catch (err) {
        setError("Could not fetch profile data. The user may not exist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const isUserOnline = (username) => {
    return onlineUsers.includes(username);
  };

  if (loading)
    return <div className="profile-page-status">Loading Profile...</div>;
  if (error) return <div className="profile-page-status error">{error}</div>;
  if (!profileData)
    return <div className="profile-page-status">Profile not found.</div>;

  // Các phần xử lý loading, error, not found giữ nguyên
  if (loading)
    return <div className="profile-page-status">Loading Profile...</div>;
  if (error) return <div className="profile-page-status error">{error}</div>;
  console.log(profileData?.avatarUrl);
  return (
    <div className="profile-page">
      <div className="dynamic-background">
        <video src="/videos/Sequence 01.mp4" autoPlay loop muted></video>
      </div>
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-info-container">
            <div className="profile-left-info">
              <div className="profile-avatar-section">
                <img
                  src={profileData?.avatarUrl}
                  alt="User Avatar"
                  className="main-avatar"
                />
                <div
                  className={`status-indicator ${isUserOnline(profileData.username) ? "online" : "offline"
                    }`}
                ></div>
              </div>

              <div className="profile-details">
                <h1 className="username">
                  {profileData?.profileName ||
                    profileData?.username ||
                    "Anonymous User"}
                </h1>
                <p className="country">
                  {profileData?.country || "Location not set"}
                </p>
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="action-btn primary"
                onClick={() =>
                  navigate(
                    `/profile/${localStorage.getItem("userId")}/edit/info`
                  )
                }
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        <div className="gender">
          <p className="gender-label">Gender : {profileData?.gender}</p>
        </div>
        <div className="dob">
          <p>DOB : {profileData?.dob}</p>
        </div>
        <div className="profile-main">
          {/* === CỘT TRÁI === */}
          <div className="profile-left">
            {/* * VÙNG GAME SHOWCASE:
             * Sẽ chỉ hiển thị nếu `profileData.showcaseGames` tồn tại và có phần tử.
             * Hiện tại dữ liệu của bạn không có, nên vùng này sẽ không hiển thị.
             */}
            <GameShowcase
              userId={profileData.userId}
              gameCount={profileData.gameCount}
            />
            {profileData.showcaseGames &&
              profileData.showcaseGames.length > 0 && (
                <div className="game-showcase section-box">
                  <h3>Games Owned</h3>
                  <div className="game-list">
                    {profileData.showcaseGames.map((game) => (
                      <Link
                        to={`/game/${game.id}`}
                        key={game.id}
                        className="game-item"
                      >
                        <img src={game.imageUrl} alt={game.title} />
                        <span>{game.title}</span>
                      </Link>
                    ))}
                  </div>
                  <Link to={`/library`} className="view-all-games">
                    {/* Sử dụng ?? để cung cấp giá trị mặc định nếu gameCount là null/undefined */}
                    View all {profileData.gameCount ?? 0} games
                  </Link>
                </div>
              )}

            {/* Bio / Summary */}
            <div className="profile-bio section-box">
              <h3>Bio</h3>
              <p>
                {/* Dùng `||` để hiển thị text mặc định nếu summary là null hoặc chuỗi rỗng */}
                {profileData.summary ||
                  "This user has not written a summary yet."}
              </p>
            </div>
          </div>

          {/* === CỘT PHẢI === */}
          <div className="profile-right">
            <div className="profile-details section-box">
              {/* Dùng Optional Chaining (?.) để tránh lỗi nếu isOnline không tồn tại */}
              {profileData.isOnline !== undefined && (
                <p
                  className={
                    isUserOnline(profileData.username) ? "status-online" : "status-offline"
                  }
                >
                  {isUserOnline(profileData.username)
                    ? "Currently Online"
                    : "Currently Offline"}
                </p>
              )}

              {/* Vùng Badges: Chỉ hiển thị nếu có dữ liệu */}
              {profileData.badges && profileData.badges.length > 0 && (
                <div className="badges">
                  <h4>
                    Badges <span>({profileData.badgeCount ?? 0})</span>
                  </h4>
                  {/* ... logic map badges ... */}
                </div>
              )}

              {/* Danh sách chi tiết: Hiển thị các thông tin có sẵn */}
              <ul className="details-list">
                {/* Dùng toán tử ?? để hiển thị 0 nếu gameCount không tồn tại */}
                <li>
                  Games <span>{profileData.gameCount ?? "N/A"}</span>
                </li>
                <li>
                  Reviews <span>{profileData.reviewCount ?? "N/A"}</span>
                </li>
                {/* Bạn có thể thêm các link tĩnh nếu muốn */}
                <li>Inventory</li>
                <li>Screenshots</li>
              </ul>

              {/* Vùng Groups: Chỉ hiển thị nếu có dữ liệu */}
              {profileData.groups && profileData.groups.length > 0 && (
                <div className="groups">
                  <h4>Groups</h4>
                  {/* ... logic map groups ... */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
