import { useState } from "react";
import axios from "axios";
import './NotificationBox.css';

/**
 * @author Phan NT Son
 * @description Component to display a single notification item
 * @param {*} param0 
 * @returns 
 */
function NotificationBoxItem({ notification, markRead }) {
    const [read, setRead] = useState(notification.read);

    const handleClick = () => {
        if (!read) {
            axios.patch(`${import.meta.env.VITE_API_URL}/notification/markread/${notification.notifId}`)
                .then(() => {
                    setRead(true);
                    markRead(notification.notifId);
                })
                .catch((error) => console.error("Error marking notification as read:", error));
        }
    };

    return (
        <li>
            <div className={`notifbox-item d-flex flex-column align-items-start px-3 py-2 w-100`}
                onClick={handleClick}>
                <p>{notification.notificationType}</p>
                <span className="notifbox-content">{notification.notificationContent}</span>
                {!read && <span className="notifbox-dot" />}

            </div>
        </li>
    );
}
export default NotificationBoxItem;