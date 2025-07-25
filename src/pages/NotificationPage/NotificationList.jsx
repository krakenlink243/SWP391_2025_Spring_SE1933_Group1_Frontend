import { useState, useEffect, useContext } from "react";
import axios from "axios";
import NotificationItem from "./NotificationItem";
import "./NotificationList.css"
import { Navigate, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/validators";
import { AppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

/**
 *
 * @returns Component to display a list of notifications for a user
 */
function NotificationList() {

  const [countUnRead, setCountUnRead] = useState(0);

  const [typeList, setTypeList] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const { token } = useAuth();
  const CUR_AVATAR_URL = localStorage.getItem("avatarUrl");
  const CUR_USERNAME = localStorage.getItem("username");
  const {t} = useTranslation();
  // Get from context ↓
  const { notifications, setNotifications } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setCountUnRead(notifications.filter(n => !n.read).length);
  }, [notifications]);

  useEffect(() => {
    setTypeList([...new Set(notifications.map(n => n.notificationType))]);
  }, [notifications]);

  const handleMarkReadAll = async () => {
    if (notifications.length === 0) return;
    if (notifications.every(n => n.read)) return
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/notification/markreadall`);
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.log("error mark read all: " + error);
    }
  };

  const handleDeleteAll = () => {
    if (notifications.length === 0) return;
    if (!window.confirm(t("Are you sure you want to delete all notifications?"))) return;
    try {
      axios.delete(`${import.meta.env.VITE_API_URL}/notification/deleteall`)
        .then((resp) => {
          setNotifications([]);
        });

    } catch (error) {
      console.log("error delete all: " + error);
    }
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const resetFilter = () => {
    setSelectedTypes([]);
  };

  const filteredData = selectedTypes.length === 0
    ? notifications
    : notifications.filter(n => selectedTypes.includes(n.notificationType));

  if (!token || isTokenExpired()) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <div className="notiflist-container col-lg-8 d-flex align-items-start flex-column py-5 text-white">
        <div className="user-header d-flex flex-row align-items-center">
          <img src={CUR_AVATAR_URL} alt="avatar" className="avatar" onClick={() => navigate("/profile")} />
          <a className="username" href="/profile">{CUR_USERNAME}</a>
        </div>
        {notifications.length > 0 ? (
          <div className="w-100 py-5 d-flex flex-row gap-4 flex-wrap">
            <div className="notiflist-title w-100">{t('Notifications (count unread)', {count: countUnRead})}</div>
            <div className="left-col">
              <div className="notiflist-list w-100 d-flex flex-column gap-2">
                {filteredData.map((notification) => (
                  <NotificationItem
                    key={notification.notifId}
                    notification={notification}
                    onClick={() => setNotifications((prev) => prev.map(n => n.notifId === notification.notifId ? { ...n, read: true } : n))}
                    onDelete={() => setNotifications((prev) => prev.filter(n => n.notifId !== notification.notifId))}
                  />
                ))}
              </div>
            </div>
            <div className="right-col">
              <div className="d-flex flex-row gap-2">
                <div className="right-col-btn" onClick={() => handleMarkReadAll()}>
                  {t('Mark All Read')}
                </div>
                <div className="right-col-btn" onClick={() => handleDeleteAll()}>
                  {t('Delete All')}
                </div>
              </div>
              <div id="filter-wrapper">
                <div id="title">{t('Filter to')}</div>
                {
                  typeList.map((type) => (
                    <label key={type} className="filter-item">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))
                }
              </div>
              <button className="reset-btn" onClick={resetFilter}>{t('Reset')}</button>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center w-100 py-5">
            <h3>{t('You have no notifications at this time.')}</h3>
            <p>{t(`This is where you'll be able to see SteamCL notifications regarding your Friends, Games, and more.`)}</p>
          </div>
        )}
      </div>
    );
  }


}

export default NotificationList;
