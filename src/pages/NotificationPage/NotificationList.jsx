import { useState, useEffect } from "react";
import axios from "axios";
import NotificationItem from "./NotificationItem";
import "./NotificationList.css"
import { Navigate } from "react-router-dom";

/**
 *
 * @returns Component to display a list of notifications for a user
 */
function NotificationList() {
  const [data, setData] = useState([]);
  const [reloadSignal, setReloadSignal] = useState(0);
  const [countUnRead, setCountUnRead] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {

    getNotificationList();
  }, [reloadSignal]);

  const reloadList = () => {
    setReloadSignal((prev) => prev + 1);
  };

  const getNotificationList = async () => {
    axios
      .get(`http://localhost:8080/notification/list`)
      .then((response) => {
        if (response.data) {
          setData(response.data);
          setCountUnRead(0);
          response.data.forEach(count);
        }
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  };

  const count = (notif) => {
    if (!notif.read) {
      setCountUnRead((prev) => prev + 1);
    }
  }

  if (!token) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <div className="notiflist-container col-lg-8 d-flex align-items-start flex-column py-5 text-white">
        <h1>Notifications ({countUnRead} unread)</h1>
        <div className="notiflist-list w-100 d-flex flex-column gap-2">
          {data.map((notification) => (
            <NotificationItem
              key={notification.notifId}
              notification={notification}
              onReload={reloadList}
            />
          ))}
        </div>
      </div>
    );
  }


}

export default NotificationList;
