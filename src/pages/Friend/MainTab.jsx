
import { useState, useEffect, useContext } from "react";
import './MainTab.css'
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MainTab({ setCurTab }) {
    // Get from context ↓
    const { friendList, onlineUsers: online } = useContext(AppContext);
    const onlineUsers = online;
    const navigate = useNavigate();
    const {t} = useTranslation();

    const isOnline = (username) => {
        return onlineUsers.includes(username);
    }

    return (
        <div className="main-tab">
            <div className="main-tab-header d-flex flex-row justify-content-between">
                <div className="status">
                    {t('Your Friends')}
                    <span className="friends-count"> {friendList.length} </span>
                    /
                    <span className="friends-limit"> 285 </span>
                </div>
                <div className="btn-add-friend" onClick={() => setCurTab(1)}>
                    <span>
                        <i className="icon"></i>
                        {t('Add Friends')}
                    </span>
                </div>
            </div>
            <div className="main-tab-body d-flex flex-row gap-2 flex-wrap">
                {friendList.length == 0 && <div>{t('You have no friends')}</div>}
                {
                    friendList.map((friend, idx) => (
                        <div
                            key={friend.friendId}
                            className={`friend-item d-flex flex-row align-items-center ${isOnline(friend.friendName) ? "online" : "offline"}`}
                            onClick={() => navigate(`/profile/${friend.friendId}`)}
                        >
                            <div className="friend-avatar">
                                <img
                                    src={friend.friendAvatarUrl}
                                    alt={friend.friendName}
                                />
                            </div>
                            <div className={`spacer`}></div>
                            <div className="friend-name">{friend.friendName}</div>
                        </div>
                    ))
                }

            </div>
        </div>
    );
};
export default MainTab;