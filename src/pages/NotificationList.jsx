import { useState, useEffect } from "react";
import axios from "axios";
import NotificationItem from "./NotificationItem";

/**
 *
 * @returns Component to display a list of notifications for a user
 */
function NotificationList() {
  const [data, setData] = useState([]);
  const [reloadSignal, setReloadSignal] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getNotificationList();
  }, [reloadSignal]);

  const reloadList = () => {
    setReloadSignal((prev) => prev + 1);
  };

  const getNotificationList = async () => {
    axios
      .get(`http://localhost:8080/notification/notification-list?userId=${userId}`)
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
        <div>
          {data.map((notification) => (
            <NotificationItem
              key={notification.notifId}
              notification={notification}
              onReload={reloadList}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default NotificationList;
