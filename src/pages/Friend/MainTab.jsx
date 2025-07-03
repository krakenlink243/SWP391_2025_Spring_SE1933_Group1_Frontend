import { useState, useEffect } from "react";
import axios from "axios";
import "./MainTab.css";
import { useOnlineUsers } from "../../utils/OnlineUsersContext";

function MainTab({ setCurTab }) {
  const [friendList, setFriendList] = useState([]);
  const onlineUsers = useOnlineUsers();
  const UNKNOW_AVATAR_URL = localStorage.getItem("unknowAvatar");

  const getFriendList = () => {
    axios
      .get("http://localhost:8080/user/friends")
      .then((response) => {
        setFriendList(response.data);
      })
      .catch((err) => {
        console.log("Error fetching friends list: " + err);
      });
  };

  const isOnline = (username) => {
    return onlineUsers.includes(username);
  };

  useEffect(() => {
    getFriendList();
  }, []);
  function navigateProfile(e) {
    const friendId = e.currentTarget.getAttribute("userId");
    window.location.href = `/profile/${friendId}`;
  }

  return (
    <div className="main-tab">
      <div className="main-tab-header d-flex flex-row justify-content-between">
        <div className="status">
          Your Friends
          <span className="friends-count"> {friendList.length} </span>/
          <span className="friends-limit"> 285 </span>
        </div>
        <div className="btn-add-friend" onClick={() => setCurTab(1)}>
          <span>
            <i className="icon"></i>
            Add a Friend
          </span>
        </div>
      </div>
      <div className="main-tab-body d-flex flex-row gap-2 flex-wrap">
        {friendList.length == 0 && <div>You have no friends</div>}
        {friendList.map((friend, idx) => (
          <div
            onClick={navigateProfile}
            key={friend.friendId}
            className={`friend-item d-flex flex-row align-items-center ${
              isOnline(friend.friendName) ? "online" : "offline"
            }`}
          >
            <div className="friend-avatar">
              <img
                src={
                  friend.friendAvatarUrl
                    ? friend.friendAvatarUrl
                    : UNKNOW_AVATAR_URL
                }
                alt={friend.friendName}
              />
            </div>
            <div className={`spacer`}></div>
            <div className="friend-name">{friend.friendName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MainTab;
