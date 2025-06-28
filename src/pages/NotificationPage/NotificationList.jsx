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
  const CUR_AVATAR_URL = localStorage.getItem("avatarUrl");
  const CUR_USERNAME = localStorage.getItem("username");

  useEffect(() => {
    if (token) {
      getNotificationList();

    }
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
        <div className="user-header d-flex flex-row align-items-center">
          <img src={CUR_AVATAR_URL} alt="avatar" className="avatar" onClick={() => window.location.href = "/profile"} />
          <a className="username" href="/profile">{CUR_USERNAME}</a>
        </div>
        {data.length > 0 ? (
          <div>
            <div className="notiflist-title">Notifications ({countUnRead} unread)</div>
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
        ) : (
          <div className="d-flex flex-column align-items-center w-100 py-5">
            <h3>You have no notifications at this time.</h3>
            <p>This is where you'll be able to see SteamCL notifications regarding your Friends, Games, and more.</p>
          </div>
        )}
      </div>
    );
  }


}

export default NotificationList;
