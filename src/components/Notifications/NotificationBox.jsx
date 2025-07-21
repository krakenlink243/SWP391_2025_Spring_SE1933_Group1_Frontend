import { useState, useEffect, useContext } from "react";
import { FaBell } from 'react-icons/fa';
import './NotificationBox.css';
import { useNavigate } from "react-router-dom";
import NotificationBoxItem from "./NotificationBoxItem";
<<<<<<< HEAD
import { AppContext } from "../../context/AppContext";
=======
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";
import { useTranslation } from "react-i18next";
>>>>>>> bathanh

/**
 * @author Phan NT Son
 * @description Component to display a list of notifications for a user
 * @param {*} param0 
 * @returns 
 */
function NotificationBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  const { notifications, setNotifications } = useContext(AppContext);
  const {t} = useTranslation();




  // Open notif box
  const toggleOpenNotification = () => {
    setIsOpen((prev) => !prev);
    setIsSeen(true);
  }

  useEffect(() => {
    setIsSeen(false);
    setUnreadNotifications(notifications.filter(n => !n.read));
  }, [notifications]);

  const handleMarkRead = (notifId) => {
    setNotifications((prev) => prev.map(n => n.notifId === notifId ? { ...n, read: true } : n));
  };

  return (
    <div className="notifbox-container">
      <div className={`notifbox-bell ${unreadNotifications.length > 0 && !isSeen ? "notif" : ""}`} onClick={toggleOpenNotification}>
        <FaBell />
      </div>

      <div className={`notifbox-box text-light p-3 ${isOpen ? "active" : ""}`}>
        <div className="notifbox-header d-flex flex-row align-items-center justify-content-around pb-3">
          <p className="notifbox-title">{t('Notifications')}</p>
          <button className="notfif-button text-light" onClick={() => navigate("/notifications")}>{t('View All')}</button>
        </div>

        <ul className="notifbox-list">
          {unreadNotifications.length > 0 ? (
            unreadNotifications.map((n) => (
              <div key={n.notifId}>
                <NotificationBoxItem
                  notification={n}
                  markRead={handleMarkRead}
                />
              </div>
            ))
          ) : (
            <li className="notifbox-empty">{t('You have no new notifications at this time')}.</li>
          )}
        </ul>
      </div>
    </div >
  );
}

export default NotificationBox;