import { useState } from "react";
import axios from "axios";
import './NotificationBox.css';
import { useNavigate } from "react-router-dom";

/**
 * @author Phan NT Son
 * @description Component to display a single notification item
 * @param {*} param0 
 * @returns 
 */
function NotificationBoxItem({ notification, markRead }) {
    const [read, setRead] = useState(notification.read);
    const navigate = useNavigate();

    const handleClick = () => {
        if (!read) {
            axios.patch(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/notification/markread/${notification.notifId}`)
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