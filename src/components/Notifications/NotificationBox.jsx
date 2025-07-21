import { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from 'react-icons/fa';
import './NotificationBox.css';
import { useNavigate } from "react-router-dom";
import NotificationBoxItem from "./NotificationBoxItem";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";
import { useTranslation } from "react-i18next";

/**
 * @author Phan NT Son
 * @description Component to display a list of notifications for a user
 * @param {*} param0 
 * @returns 
 */
function NotificationBox() {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const CUR_TOKEN = localStorage.getItem("token");
  const socketNotifications = useUnreadNotifications(CUR_TOKEN);
  const navigate = useNavigate();
  const {t} = useTranslation();



  useEffect(() => {
    console.log("Refresh notiflist");
    setData(socketNotifications);
  }, [socketNotifications]);
 

  // Open notif box
  const toggleOpenNotification = () => {
    setIsOpen((prev) => !prev);
  }

  const handleMarkRead = (notifId) => {
    setData(prev =>
      prev.map(n =>
        n.notifId === notifId ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="notifbox-container">
      <div className={`notifbox-bell ${data.length > 0 ? "notif" : ""}`} onClick={toggleOpenNotification}>
        <FaBell />
      </div>

      <div className={`notifbox-box text-light p-3 ${isOpen ? "active" : ""}`}>
        <div className="notifbox-header d-flex flex-row align-items-center justify-content-around pb-3">
          <p className="notifbox-title">{t('Notifications')}</p>
          <button className="notfif-button text-light" onClick={() => navigate("/notifications")}>{t('View All')}</button>
        </div>

        <ul className="notifbox-list">
          {data.length > 0 ? (
            data.map((n) => (
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