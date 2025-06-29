import { useState, useEffect } from "react";
import axios from "axios";
import "./NotificationList.css"

/**
 * @author Phan NT Son
 * @description Component to display a single notification item
 * @param {*} param0 
 * @returns 
 */
function NotificationItem({ notification, onReload }) {
  const handleClick = () => {
    if (!notification.read) {
      axios.patch(`http://localhost:8080/notification/markread/${notification.notifId}`)
        .then(() => {
          onReload();
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
    <div
      className={`notiflist-item ${notification.read ? '' : 'unread'} d-flex flex-row w-100 justify-content-between p-2`}
      onClick={handleClick}
    >
      {!notification.read && <span className="notiflist-dot" />}

      <div>
        <div className="notiflist-type">{notification.notificationType}</div>
        <div className="notiflist-content">{notification.notificationContent}</div>
      </div>
      <div>
        <div
          className="notiflist-delete-btn"
          onClick={e => {
            e.stopPropagation();
            handleDelete();
          }}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          aria-label="Delete notification"
        >
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24px"
            height="24px"
            viewBox="0 0 256 256"
            style={{ overflow: "visible", width: "100%", height: "100%", maxWidth: "32px", maxHeight: "32px" }}
          >
            <g className="base">
              <path
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M216.773,43.909 l-7.399,177.589c-0.37,8.893-7.919,16.1-16.812,16.1H63.437c-8.914,0-16.442-7.24-16.812-16.1L39.226,43.909"
              ></path>
            </g>
            <g className="lines">
              <path
                className="line1"
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M128,68.12v137.197"
              ></path>
              <path
                className="line2"
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M83.613,68.12 l4.035,137.197"
              ></path>
              <path
                className="line3"
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M172.387,68.12 l-4.035,137.197"
              ></path>
            </g>
            <g className="lid">
              <path
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M27.121,38.577H228.88"
              ></path>
              <path
                fill="none"
                strokeWidth="10"
                d="M87.648,38.577l4.319-10.796c2.072-5.181,8.292-9.379,13.84-9.379h44.386
               c5.572,0,11.761,4.18,13.841,9.379l4.319,10.796"
              ></path>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
export default NotificationItem;