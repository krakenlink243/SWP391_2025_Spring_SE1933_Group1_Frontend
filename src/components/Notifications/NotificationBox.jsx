import { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from 'react-icons/fa';
import './NotificationBox.css';

import NotificationBoxItem from "./NotificationBoxItem";

/**
 * @author Phan NT Son
 * @description Component to display a list of notifications for a user
 * @param {*} param0 
 * @returns 
 */
function NotificationBox() {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getUnreadNotificationList();
  }, [isOpen]);

  const getUnreadNotificationList = async () => {
    axios.get(`http://localhost:8080/notification/unread/notification-list?userId=${userId}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }

  const toggleOpenNotification = () => {
    setIsOpen((prev) => !prev);

  }

  return (
    <div className="notif-container">
      <div className="notif-bell" onClick={toggleOpenNotification}>
        <FaBell />
        {data.length > 0 && <span className="notif-badge"></span>}

      </div>

      {isOpen && (
        <div className="notif-box text-light p-3">
          <div className="notif-header d-flex flex-row align-items-center justify-content-around pb-3">
            <p className="notif-title">Notifications</p>
            <button className="notfif-button text-light" onClick={() => window.location.href = "/notifications"}>View All</button>
          </div>

          <ul className="notif-list">
            {data.length > 0 ? (
              data.map((n) => (
                <NotificationBoxItem key={n.notifId} notification={n} />
              ))
            ) : (
              <li className="notif-empty">You have no new notifications at this time.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotificationBox;