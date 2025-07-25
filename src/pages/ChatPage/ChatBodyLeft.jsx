import { useState, useEffect, useRef, useContext } from "react";
import './ChatBodyLeft.css';
import { AppContext } from "../../context/AppContext";
import Split from "split.js";
import { Link, useNavigate } from "react-router-dom";
import GroupAvatar from "./GroupAvatar";
import { useTranslation } from "react-i18next";

function ChatBodyLeft({ setCurChat, setOpenPopup }) {
    const avatarUrl = localStorage.getItem("avatarUrl");
    const username = localStorage.getItem("username");
    const { t } = useTranslation();
    const { friendList, groupChats, onlineUsers } = useContext(AppContext);
    const navigate = useNavigate();

    const headerH = useRef(null);
    const footerH = useRef(null);
    const [listH, setListH] = useState("100%");

    const onlineFriends = friendList.filter(f => onlineUsers.includes(f.friendName));
    const offlineFriends = friendList.filter(f => !onlineUsers.includes(f.friendName));

    const [isHover, setIsHover] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const filteredFriends = friendList.filter(friend =>
        friend.friendName.toLowerCase().includes(searchKeyword.toLowerCase())
    );


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
                            <div className="current-avatar" onClick={() => navigate('/profile')}>
                                <img src={avatarUrl} alt="avatar"></img>
                            </div>
                            <div className="label-holder d-flex flex-column">
                                <div className="name">{username}</div>
                                <div className="status">{t('Online')}</div>
                            </div>
                        </div>
                    </div>

                </div>

                <div id="middle-pane" className="d-flex split flex-column " style={{ height: `${listH}` }}>
                    <div id="friend-pane" className="friend-list-content" >
                        <div className="wrapper-header">
                            {t('Friends')}
                            <div className={`search-friend-bar h-100 d-flex flex-row`}
                                style={{ opacity: isHover ? "1" : "0" }}
                                onMouseEnter={() => setIsHover(true)}
                                onMouseLeave={() => (
                                    searchKeyword === "" && setIsHover(false)
                                )}
                            >
                                <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ padding: '5px' }}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path clip-rule="evenodd" d="M12.2852 4.05704C7.74092 4.05704 4.05704 7.74092 4.05704 12.2852C4.05704 16.8295 7.74092 20.5134 12.2852 20.5134C16.8295 20.5134 20.5134 16.8295 20.5134 12.2852C20.5134 7.74092 16.8295 4.05704 12.2852 4.05704ZM2 12.2852C2 6.60485 6.60485 2 12.2852 2C17.9656 2 22.5704 6.60485 22.5704 12.2852C22.5704 17.9656 17.9656 22.5704 12.2852 22.5704C6.60485 22.5704 2 17.9656 2 12.2852Z" fill="#fcfcfc" fill-rule="evenodd"></path><path d="M19.8786 18.3487L25.6829 24.153C26.1057 24.5758 26.1057 25.2613 25.6829 25.6841C25.2601 26.1069 24.5746 26.1069 24.1518 25.6841L18.3475 19.8798L19.8786 18.3487Z" fill="#fcfcfc"></path></g></svg>
                                <div className="search-bar d-flex flex-row justify-content-center align-items-center h-100"
                                    style={{ pointerEvents: isHover ? "auto" : "none" }}

                                >
                                    <input
                                        type="text"
                                        placeholder="search friend"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    >
                                    </input>

                                </div>
                            </div>
                            <div className="icon">
                                <Link to={"/profile/friends"}>
                                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" className="SVGIcon_Button SVGIcon_AddFriend" x="0px" y="0px" width="256px" height="256px" viewBox="0 0 256 256"><g className="friendHead" transform="matrix(1.34048,0,0,1.34048,-10.0942,-5.50445)"><circle cx="86.296" cy="47.419" r="33.526" fill="currentcolor"></circle></g><path className="friendBody" d="M100.353,170.882c0-23.589,10.397-44.736,26.842-59.152c-3.352-0.423-6.773-0.649-10.257-0.649H94.231	c-39.775,0-56.481,28.271-56.481,63.099v41.88c0,0-0.3,16.369,35.917,21.813c36.217,5.444,73.651,5,73.651,5 C119.666,230.681,100.353,203.044,100.353,170.882z" fill="currentColor"></path><path className="plusCircle" d="M179.01,103.892c-36.998,0-66.99,29.992-66.99,66.99s29.994,66.989,66.99,66.989c36.997,0,66.99-29.991,66.99-66.989 S216.008,103.892,179.01,103.892z M217.893,175.882h-33.647v33.882c0,2.762-2.239,5-5,5s-5-2.238-5-5v-33.882h-33.647 c-2.762,0-5-2.238-5-5c0-2.763,2.238-5,5-5h33.647V132.47c0-2.762,2.239-5,5-5s5,2.238,5,5v33.412h33.647c2.762,0,5,2.237,5,5 C222.893,173.643,220.654,175.882,217.893,175.882z" fill="currentColor"></path></svg>
                                </Link>
                            </div>
                        </div>
                        <div className="friend-list-wrapper">


                            {
                                searchKeyword === "" ? (
                                    <div>
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
                                ) : (
                                    <div>
                                        {filteredFriends.map(friend => (
                                            <div
                                                className="friend offline"
                                                key={friend.friendId}
                                                onClick={() => (
                                                    setCurChat({ type: 'friend', id: friend.friendId, name: friend.friendName, avatarUrl: friend.friendAvatarUrl }),
                                                    setSearchKeyword(""),
                                                    setIsHover(false)
                                                )}
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
                                )
                            }

                        </div>
                    </div>
                    <div id="group-pane" className="group-chat-content">
                        <div className="wrapper-header">
                            Group Chats ({groupChats.length}/10)
                            <div className="icon" onClick={() => setOpenPopup(true)}>
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className="SVGIcon_Button SVGIcon_NewChatGroup" x="0px" y="0px" viewBox="0 0 256 256"><path className="Bubble" strokeWidth="12" strokeMiterlimit="10" d="M127.393,10.833 c64.854,0,117.46,52.609,117.46,117.013c0,24.035-7.254,45.804-19.5,63.943c-4.99,7.711,13.15,39.457,20.408,51.705 c4.989,8.612-51.701-19.05-59.412-14.514c-17.233,9.979-37.188,15.872-58.957,15.872c-64.859,0-117.465-52.607-117.465-117.008 C9.928,63.442,62.534,10.833,127.393,10.833z"></path><line strokeWidth="22" strokeLinecap="round" strokeMiterlimit="10" x1="83.5" y1="128.886" x2="176.184" y2="128.886"></line><line strokeWidth="22" strokeLinecap="round" strokeMiterlimit="10" x1="129.842" y1="82.544" x2="129.842" y2="175.228"></line></svg>
                            </div>
                        </div>
                        <div className="group-chat-wrapper">
                            {
                                groupChats.map(group => (
                                    <div
                                        className="group"
                                        key={group.groupId}
                                        onClick={() => setCurChat({ type: 'group', id: group.groupId, name: group.groupName })}
                                    >
                                        <div className="group-avatar-container">
                                            <GroupAvatar
                                                groupId={group.groupId}
                                            />
                                        </div>
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