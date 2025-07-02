import { useState, useEffect } from "react";
import axios from "axios";
import { connectSocketNotif, disconnectSocketNotif } from "../../services/notification";
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  // Connect socket and constantly update the notification 
  useEffect(() => {

    const onNotifReceived = (notif) => {
      setData((prev) => {
        // Check if notifId already exists
        if (prev.some(n => n.notifId === notif.notifId)) {
          return prev;
        }
        return [...prev, notif];
      });
    };

    connectSocketNotif(onNotifReceived);

    return () => {
      disconnectSocketNotif();
    }
  }, []);



  // Update the total unread notification
  useEffect(() => {
    const unread = data.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [data]);

  // Get list of Unread notif from DB when Token & pathname change
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token: " + token);
      getUnreadNotificationList();
    }
  }, []);

  const getUnreadNotificationList = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/notification/list/unread`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }

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
    console.log("NOTIF LIST: " + data);

  };

  return (
    <div className="notifbox-container">
      <div className={`notifbox-bell ${unreadCount > 0 ? "notif" : ""}`} onClick={toggleOpenNotification}>
        <FaBell />
      </div>

      <div className={`notifbox-box text-light p-3 ${isOpen ? "active" : ""}`}>
        <div className="notifbox-header d-flex flex-row align-items-center justify-content-around pb-3">
          <p className="notifbox-title">Notifications</p>
          <button className="notfif-button text-light" onClick={() => window.location.href = "/notifications"}>View All</button>
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
            <li className="notifbox-empty">You have no new notifications at this time.</li>
          )}
        </ul>
      </div>
    </div >
  );
}

export default NotificationBox;