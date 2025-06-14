import { useState, useEffect } from "react";
import axios from "axios";

/**
 * @author Phan NT Son
 * @description Component to display a single notification item
 * @param {*} param0 
 * @returns 
 */
function NotificationItem({ notification, onReload }) {
  const [read, setRead] = useState(notification.read);

  const handleClick = () => {
    if (!read) {
      axios.patch(`http://localhost:8080/notification/mark-as-read/${notification.notifId}`)
        .then(() => {
          setRead(true);
        })
        .catch((error) => console.error("Error marking notification as read:", error));
    }
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:8080/notification/delete/${notification.notifId}`)
      .then(() => {
        // Optionally, you can refresh the notification list or remove the item from the UI
        console.log("Notification deleted successfully");
        onReload();
      })
      .catch((error) => console.error("Error deleting notification:", error));
  };

  return (
    <li
      className={`notif-item ${read ? '' : 'unread'}`}
      onClick={handleClick}
    >
      <span className="notif-type">{notification.notificationType}</span>
      <span className="notif-content">{notification.notificationContent}</span>
      {!read && <span className="notif-dot" />}
      <button className="notif-delete-btn" onClick={handleDelete}>✕</button>
    </li>
  );
}
export default NotificationItem;