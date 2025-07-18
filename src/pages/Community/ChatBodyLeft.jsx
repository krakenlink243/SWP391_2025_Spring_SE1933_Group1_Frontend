import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import './ChatBodyLeft.css';
import { AppContext } from "../../context/AppContext";
import Split from "split.js";
import { Link } from "react-router-dom";

function ChatBodyLeft({ setCurChat, setOpenPopup, friendList, groupChats }) {
    const avatarUrl = localStorage.getItem("avatarUrl");
    const username = localStorage.getItem("username");



    const headerH = useRef(null);
    const footerH = useRef(null);
    const [listH, setListH] = useState("100%");

    // Get from context ↓
    const { onlineUsers } = useContext(AppContext);


    const onlineFriends = friendList.filter(f => onlineUsers.includes(f.friendName));
    const offlineFriends = friendList.filter(f => !onlineUsers.includes(f.friendName));


    useEffect(() => {
        const updateHeights = () => {
            const header = headerH.current?.offsetHeight || 0;
            const footer = footerH.current?.offsetHeight || 0;
            setListH(`calc(100% - ${header + footer}px)`);
        };

        updateHeights();

        // Wait for layout
        setTimeout(updateHeights, 0);
        window.addEventListener("resize", updateHeights);
        return () => window.removeEventListener("resize", updateHeights);
    }, []);

    useEffect(() => {
        const instance = Split(['#friend-pane', '#group-pane'], {
            sizes: [70, 30],
            gutterSize: 5,
            direction: 'vertical',
        });

        return () => instance.destroy();
    }, []);




    return (
        <div id="left-pane" className="friends-list-container bg-light h-100">
            <div className="friend-list h-100 d-flex flex-column">
                {/* HEADER */}
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

                <div id="middle-pane" className="d-flex split flex-column h-100" style={{ height: `${listH}` }}>
                    <div id="friend-pane" className="friend-list-content" >
                        <div className="friend-list-wrapper">
                            <div className="wrapper-header">
                                Friends
                                <div className="icon">
                                    <Link to={"/profile/friends"}>
                                        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" className="SVGIcon_Button SVGIcon_AddFriend" x="0px" y="0px" width="256px" height="256px" viewBox="0 0 256 256"><g className="friendHead" transform="matrix(1.34048,0,0,1.34048,-10.0942,-5.50445)"><circle cx="86.296" cy="47.419" r="33.526" fill="currentcolor"></circle></g><path className="friendBody" d="M100.353,170.882c0-23.589,10.397-44.736,26.842-59.152c-3.352-0.423-6.773-0.649-10.257-0.649H94.231	c-39.775,0-56.481,28.271-56.481,63.099v41.88c0,0-0.3,16.369,35.917,21.813c36.217,5.444,73.651,5,73.651,5 C119.666,230.681,100.353,203.044,100.353,170.882z" fill="currentColor"></path><path className="plusCircle" d="M179.01,103.892c-36.998,0-66.99,29.992-66.99,66.99s29.994,66.989,66.99,66.989c36.997,0,66.99-29.991,66.99-66.989 S216.008,103.892,179.01,103.892z M217.893,175.882h-33.647v33.882c0,2.762-2.239,5-5,5s-5-2.238-5-5v-33.882h-33.647 c-2.762,0-5-2.238-5-5c0-2.763,2.238-5,5-5h33.647V132.47c0-2.762,2.239-5,5-5s5,2.238,5,5v33.412h33.647c2.762,0,5,2.237,5,5 C222.893,173.643,220.654,175.882,217.893,175.882z" fill="currentColor"></path></svg>
                                    </Link>
                                </div>
                            </div>
                            {onlineFriends.map(friend => (
                                <div
                                    className="friend online"
                                    key={friend.friendId}
                                    onClick={() => setCurChat({ type: 'friend', id: friend.friendId, name: friend.friendName, avatarUrl: friend.friendAvatarUrl })}
                                >
                                    <div className="friend-avatar">
                                        <img src={friend.friendAvatarUrl} alt={friend.friendName} />
                                    </div>
                                    <div className="spacer"></div>
                                    <div className="friend-name">
                                        {friend.friendName}
                                    </div>
                                </div>
                            ))}
                            {offlineFriends.map(friend => (
                                <div
                                    className="friend offline"
                                    key={friend.friendId}
                                    onClick={() => setCurChat({ type: 'friend', id: friend.friendId, name: friend.friendName, avatarUrl: friend.friendAvatarUrl })}
                                >
                                    <div className="friend-avatar">
                                        <img src={friend.friendAvatarUrl} alt={friend.friendName} />
                                    </div>
                                    <div className="spacer"></div>
                                    <div className="friend-name">
                                        {friend.friendName}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div id="group-pane" className="group-chat-content">
                        <div className="group-chat-wrapper">
                            <div className="wrapper-header">
                                Group Chats
                                <div className="icon" onClick={() => setOpenPopup(true)}>
                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" className="SVGIcon_Button SVGIcon_AddFriend" x="0px" y="0px" width="256px" height="256px" viewBox="0 0 256 256"><g className="friendHead" transform="matrix(1.34048,0,0,1.34048,-10.0942,-5.50445)"><circle cx="86.296" cy="47.419" r="33.526" fill="currentcolor"></circle></g><path className="friendBody" d="M100.353,170.882c0-23.589,10.397-44.736,26.842-59.152c-3.352-0.423-6.773-0.649-10.257-0.649H94.231	c-39.775,0-56.481,28.271-56.481,63.099v41.88c0,0-0.3,16.369,35.917,21.813c36.217,5.444,73.651,5,73.651,5 C119.666,230.681,100.353,203.044,100.353,170.882z" fill="currentColor"></path><path className="plusCircle" d="M179.01,103.892c-36.998,0-66.99,29.992-66.99,66.99s29.994,66.989,66.99,66.989c36.997,0,66.99-29.991,66.99-66.989 S216.008,103.892,179.01,103.892z M217.893,175.882h-33.647v33.882c0,2.762-2.239,5-5,5s-5-2.238-5-5v-33.882h-33.647 c-2.762,0-5-2.238-5-5c0-2.763,2.238-5,5-5h33.647V132.47c0-2.762,2.239-5,5-5s5,2.238,5,5v33.412h33.647c2.762,0,5,2.237,5,5 C222.893,173.643,220.654,175.882,217.893,175.882z" fill="currentColor"></path></svg>
                                </div>
                            </div>
                            {
                                groupChats.map(group => (
                                    <div
                                        className="group"
                                        key={group.groupId}
                                        onClick={() => setCurChat({ type: 'group', id: group.groupId, name: group.groupName })}
                                    >
                                        <div className="group-avatar">
                                            <img src={""} alt={group.groupName} />
                                        </div>
                                        <div className="spacer"></div>
                                        <div className="group-name">
                                            {group.groupName}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* FOOTER */}
                <div className="friend-list-footer" ref={footerH}>
                </div>
            </div>
        </div>
    );
}

export default ChatBodyLeft;