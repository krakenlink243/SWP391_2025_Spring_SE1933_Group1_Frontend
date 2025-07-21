import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import GameShowcase from "./GameShowcase";
import "./ProfilePage.css";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { isTokenExpired } from "../../utils/validators";
import { useTranslation } from "react-i18next";

const ProfileHeader = ({
  user,
  isOwnProfile,
  onEditClick,
  onMessageClick,
  onAddFriendClick,
}) => {
  const avatarUrl =
    user?.avatarUrl ||
    "https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg";

  const { onlineUsers } = useContext(AppContext);

  const isOnline = onlineUsers.includes(user.username);

  const [friendList, setFriendList] = useState([]);
  const getFriendList = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/user/friends`)
      .then((response) => { setFriendList(response.data) })
      .catch((err) => { console.log("Error fetching friends list: " + err) })
  };

  const handleUnfriend = (friendId) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/user/unfriend/${friendId}`)
      .then((resp) => {
        setFriendList(prev => prev.filter(friend => friend.friendId !== friendId));
      })
      .catch((err) => {
        console.log("Error unfriend: ", err);
      })
  }

  const CUR_TOKEN = useAuth();
  useEffect(() => {
    if (CUR_TOKEN && !isTokenExpired()) {
      getFriendList();
    }
  }, [])
   const {t} = useTranslation();
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
              {user?.profileName || user?.username || t("Anonymous User")}
            </h1>
            <p className="country">{user?.country || t("Location not set")}</p>
          </div>
        </div>

        <div className="profile-actions">
          {isOwnProfile ? (
            <button className="action-btn primary" onClick={onEditClick}>
              {t('Edit Profile')}
            </button>
          ) : (
            <>
              {friendList.some(friend => friend.friendName === user.username) ? (
                <div className="d-flex flex-row gap-3">
                  <button className="action-btn secondary" onClick={onMessageClick}>
                    {t('Message')}
                  </button>

                  <button className="action-btn secondary" onClick={() => handleUnfriend(user.userId)}>
                    {t('Unfriend')}
                  </button>

                </div>
              ) : (
                <button className="action-btn primary" onClick={onAddFriendClick}>
                  {t('Add Friend')}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  // Lấy ID của profile đang được xem từ URL (ví dụ: /profile/123)
  const { userId: profileId } = useParams();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy ID của người dùng đang đăng nhập từ localStorage
  const loggedInUserId = localStorage.getItem("userId");

  // So sánh để biết đây có phải là trang của chính mình không
  // Cần chuyển cả hai sang kiểu số để so sánh chính xác
  const isOwnProfile =
    loggedInUserId && parseInt(loggedInUserId, 10) === parseInt(profileId, 10);

  useEffect(() => {
    // Nếu không có ID trên URL, chuyển hướng đến trang profile của người dùng đang đăng nhập
    if (!profileId && loggedInUserId) {
      navigate(`/profile/${loggedInUserId}`, { replace: true });
      return;
    }
    // Nếu không có ID nào cả (cả trên URL và localStorage), báo lỗi
    if (!profileId) {
      setLoading(false);
      setError(t("No profile to display. Please log in or specify a user ID."));
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Luôn fetch dữ liệu của profileId trên URL
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile/${profileId}`
        );
        setProfileData(response.data);
      } catch (err) {
        setError(t("Could not fetch profile data. The user may not exist."));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [profileId, loggedInUserId, navigate]); // Chạy lại khi ID trên URL thay đổi

  // === CÁC HÀM XỬ LÝ SỰ KIỆN ===
  const handleEditRedirect = () => {
    if (isOwnProfile) {
      navigate(`/profile/${profileData.userId}/edit/info`);
    }
  };

  const handleSendMessage = () => {
    navigate("/chat");
  };

  const handleAddFriend = () => {
    axios.post(
      `${import.meta.env.VITE_API_URL}/user/sendinvite/${profileData.userId}`
    );
    alert(
      t(`Friend request sent to`, {userName: profileData.profileName})
    );
  };

  if (loading)
    return <div className="profile-page-status">{t('Loading Profile...')}</div>;
  if (error) return <div className="profile-page-status error">{error}</div>;
  if (!profileData)
    return <div className="profile-page-status">{t('Profile not found')}.</div>;

  return (
    <div className="profile-page container-fluid">
      <div className="row">
        <div className="dynamic-background">
          <video src="/FckyouPewDiePie.mp" autoPlay loop muted></video>
        </div>
        <div className="spacer col-lg-2"></div>
        <div className="main-content col-lg-8">
          <div className="profile-content">
            <ProfileHeader
              user={profileData}
              isOwnProfile={isOwnProfile}
              onEditClick={handleEditRedirect}
              onMessageClick={handleSendMessage}
              onAddFriendClick={handleAddFriend}
            />
            <div className="profile-main">
              <div className="profile-left">
                <GameShowcase
                  userId={profileData.userId}
                  gameCount={profileData.totalGames || 0}
                />
                <div className="profile-bio section-box">
                  <h3>{t('Bio')}</h3>
                  <p>
                    {profileData.summary ||
                      t("This user has not written a summary yet.")}
                  </p>
                </div>
              </div>
              <div className="profile-right">
                <div className="profile-details section-box">
                  <ul className="details-list">
                    <li>
                      {t('Games')} <span>{profileData.totalGames ?? "N/A"}</span>
                    </li>
                    <li>
                      {t('Reviews')} <span>{profileData.reviewCount ?? "N/A"}</span>
                    </li>
                    <li>{t('Inventory')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="spacer col-lg-2"></div>
      </div>

    </div>
  );
};

export default ProfilePage;
