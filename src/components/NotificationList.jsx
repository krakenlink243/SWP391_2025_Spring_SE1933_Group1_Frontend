import { useState, useEffect } from "react";
import axios from "axios";
import NotificationItem from "./NotificationItem";

/**
 *
 * @returns Component to display a list of notifications for a user
 */
function NotificationList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getNotificationList();
  }, []);

  const getNotificationList = async () => {
    axios
      .get(`http://localhost:8080/notification/notification-list?userId=${1}`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  };

  return (
    <>
      <div>
        <h1>Notifications</h1>
        <ul>
          {data.map((notification) => (
            <NotificationItem
              key={notification.notifId}
              notification={notification}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

export default NotificationList;
