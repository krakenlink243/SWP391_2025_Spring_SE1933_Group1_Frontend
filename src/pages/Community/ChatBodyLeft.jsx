import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import './ChatBodyLeft.css';
import { AppContext } from "../../context/AppContext";

function ChatBodyLeft({ setCurFriendChat }) {
    const avatarUrl = localStorage.getItem("avatarUrl");
    const username = localStorage.getItem("username");
    const [friendList, setFriendList] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [offlineFriends, setOfflineFriends] = useState([]);
    const headerH = useRef(null);
    const footerH = useRef(null);
    const [listH, setListH] = useState("100%");
    const UNKNOW_AVATAR_URL = localStorage.getItem("unknowAvatar");
    
    // Get from context ↓
    const { onlineUsers: online } = useContext(AppContext);

    const onlineUsers = online;


    useEffect(() => {
        getFriendList();
        const header = headerH.current?.offsetHeight || 0;
        const footer = footerH.current?.offsetHeight || 0;
        setListH(`calc(100% - ${header + footer}px)`);
    }, [headerH.current, footerH.current])

    useEffect(() => {
        const online = friendList.filter(friend => onlineUsers.includes(friend.friendName));
        const offline = friendList.filter(friend => !onlineUsers.includes(friend.friendName));
        setOnlineFriends(online);
        setOfflineFriends(offline);

    }, [friendList, onlineUsers]);

    const getFriendList = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/user/friends`)
            .then((response) => { setFriendList(response.data) })
            .catch((err) => { console.log("Error fetching friends list: " + err) })
    };

    return (
        <div id="left-pane" className="friends-list-container bg-light h-100">
            <div className="friend-list h-100 d-flex flex-column">
                <div className="friend-list-header-container" ref={headerH}>
                    <div className="current-user online d-flex flex-row">
                        <svg className="status-header-glow" width="100%" height="132" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="exampleGradient" cx="50%" cy="50%" r="50%" fx="35%" fy="30%"><stop offset="10%" stopColor="gold"></stop><stop offset="95%" stopColor="green"></stop></radialGradient></defs><ellipse cx="5%" cy="28%" rx="65%" ry="60%" fill="url(#exampleGradient)"></ellipse></svg>
                        <div className="avatar-and-user d-flex">
                            <div className="current-avatar">
                                <img src={avatarUrl} alt="avatar"></img>
                            </div>
                            <div className="label-holder d-flex flex-column">
                                <div className="name">{username}</div>
                                <div className="status">Online</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="friend-list-content" style={{ height: `${listH}` }}>
                    <div className="friend-list-wrapper">
                        {onlineFriends.map(friend => (
                            <div className="friend online" key={friend.friendId} onClick={() => setCurFriendChat(friend)}>
                                <div className="friend-avatar">
                                    <img src={friend.friendAvatarUrl ? friend.friendAvatarUrl : UNKNOW_AVATAR_URL} alt={friend.friendName} />
                                </div>
                                <div className="spacer"></div>
                                <div className="friend-name">
                                    {friend.friendName}
                                </div>
                            </div>
                        ))}
                        {offlineFriends.map(friend => (
                            <div className="friend offline" key={friend.friendId} onClick={() => setCurFriendChat(friend)}>
                                <div className="friend-avatar">
                                    <img src={friend.friendAvatarUrl ? friend.friendAvatarUrl : UNKNOW_AVATAR_URL} alt={friend.friendName} />
                                </div>
                                <div className="spacer"></div>
                                <div className="friend-name">
                                    {friend.friendName}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="friend-list-footer" ref={footerH}>
                </div>
            </div>
        </div>
    );
}
export default ChatBodyLeft;