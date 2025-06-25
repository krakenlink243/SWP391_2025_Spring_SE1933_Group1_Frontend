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
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      getUnreadNotificationList();
    }
  }, [isOpen]);

  const getUnreadNotificationList = () => {
    axios.get(`http://localhost:8080/notification/list/unread`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }

  const toggleOpenNotification = () => {
    setIsOpen((prev) => !prev);
  }

  return (
    <div className="notifbox-container">
      <div className="notifbox-bell" onClick={toggleOpenNotification}>
        <FaBell />
        {data.length > 0 && <span className="notifbox-badge"></span>}

      </div>

      {isOpen && (
        <div className="notifbox-box text-light p-3">
          <div className="notifbox-header d-flex flex-row align-items-center justify-content-around pb-3">
            <p className="notifbox-title">Notifications</p>
            <button className="notfif-button text-light" onClick={() => window.location.href = "/notifications"}>View All</button>
          </div>

          <ul className="notifbox-list">
            {data.length > 0 ? (
              data.map((n) => (
                <NotificationBoxItem key={n.notifId} notification={n} />
              ))
            ) : (
              <li className="notifbox-empty">You have no new notifications at this time.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotificationBox;