import { useState, useEffect } from "react";
import axios from "axios";
import { FaBell, FaEnvelope, FaCog } from 'react-icons/fa';
import './NotificationBox.css';
import NotificationItem from "./NotificationItem";

/**
 * @author Phan NT Son
 * @description Component to display a list of notifications for a user
 * @param {*} param0 
 * @returns 
 */
function NotificationBox({ userId }) {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getUnreadNotificationList();
  }, []);

  const getUnreadNotificationList = async () => {
    axios.get(`http://localhost:8080/notification/unread/notification-list?userId=${userId}`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }

  const toggleOpenNotification = () => {
    setIsOpen(!isOpen);
    if (!isOpen == false) {
      getUnreadNotificationList();
    }
  }

  return (
    <div className="notif-container">
      <div className="notif-bell" onClick={toggleOpenNotification}>
        <FaBell />
        {data.length > 0 && <span className="notif-badge">{data.length}</span>}
      </div>
      {isOpen && (
        <div className="notif-box">
          <div className="notif-header">
            <p className="notif-title">Notifications</p>
            <div className="notif-icons">
              <FaEnvelope className="notif-icon" />
              <FaCog className="notif-icon" />
            </div>
          </div>
          <ul className="notif-list">
            {data.map((n) => (
              <NotificationItem key={n.notifId} notification={n} />
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default NotificationBox;