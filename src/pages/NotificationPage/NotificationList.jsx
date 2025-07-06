import { useState, useEffect, useContext } from "react";
import axios from "axios";
import NotificationItem from "./NotificationItem";
import "./NotificationList.css"
import { Navigate, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/validators";
import { AppContext } from "../../context/AppContext";

/**
 *
 * @returns Component to display a list of notifications for a user
 */
function NotificationList() {
  const [data, setData] = useState([]);
  const [reloadSignal, setReloadSignal] = useState(0);
  const [countUnRead, setCountUnRead] = useState(0);
  const [typeList, setTypeList] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const token = localStorage.getItem("token");
  const CUR_AVATAR_URL = localStorage.getItem("avatarUrl");
  const CUR_USERNAME = localStorage.getItem("username");
  // Get from context ↓
  const { notification } = useContext(AppContext);
  const socketNotifications = notification;
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !isTokenExpired()) {
      getNotificationList();
    }
  }, [reloadSignal]);

  useEffect(() => {

    if (socketNotifications && Array.isArray(socketNotifications)) {
      setData(prevData => {
        const existingIds = new Set(prevData.map(n => n.notifId));
        const newNotifs = socketNotifications.filter(n => !existingIds.has(n.notifId));
        if (newNotifs.length === 0) return prevData;
        const updatedData = [...newNotifs, ...prevData];
        setCountUnRead(updatedData.filter(n => n.read === false).length);
        setTypeList([...new Set(updatedData.map(n => n.notificationType))]);
        return updatedData;
      });
    }
  }, [socketNotifications])


  const reloadList = () => {
    setReloadSignal((prev) => prev + 1);
  };

  const getNotificationList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/notification/list`);
      const notifs = response.data || [];

      setData(notifs);
      setCountUnRead(notifs.filter(n => n.read === false).length);
      setTypeList([...new Set(notifs.map(n => n.notificationType))]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkReadAll = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/notification/markreadall`);
      reloadList();
    } catch (error) {
      console.log("error mark read all: " + error);
    }
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) return;
    try {
      axios.delete(`${import.meta.env.VITE_API_URL}/notification/deleteall`)
        .then((resp) => {
          reloadList();
        });

    } catch (error) {
      console.log("error delete all: " + error);
    }
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const resetFilter = () => {
    setSelectedTypes([]);
  };

  const filteredData = selectedTypes.length === 0
    ? data
    : data.filter(n => selectedTypes.includes(n.notificationType));

  if (!token || isTokenExpired()) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <div className="notiflist-container col-lg-8 d-flex align-items-start flex-column py-5 text-white">
        <div className="user-header d-flex flex-row align-items-center">
          <img src={CUR_AVATAR_URL} alt="avatar" className="avatar" onClick={() => navigate("/profile")} />
          <a className="username" href="/profile">{CUR_USERNAME}</a>
        </div>
        {data.length > 0 ? (
          <div className="w-100 py-5 d-flex flex-row gap-4 flex-wrap">
            <div className="notiflist-title w-100">Notifications ({countUnRead} unread)</div>
            <div className="left-col">
              <div className="notiflist-list w-100 d-flex flex-column gap-2">
                {filteredData.map((notification) => (
                  <NotificationItem
                    key={notification.notifId}
                    notification={notification}
                    onReload={reloadList}
                  />
                ))}
              </div>
            </div>
            <div className="right-col">
              <div className="d-flex flex-row gap-2">
                <div className="right-col-btn" onClick={() => handleMarkReadAll()}>
                  Mark All Read
                </div>
                <div className="right-col-btn" onClick={() => handleDeleteAll()}>
                  Delete All
                </div>
              </div>
              <div id="filter-wrapper">
                <div id="title">Filter to</div>
                {
                  typeList.map((type) => (
                    <label key={type} className="filter-item">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))
                }
              </div>
              <button className="reset-btn" onClick={resetFilter}>Reset</button>
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
