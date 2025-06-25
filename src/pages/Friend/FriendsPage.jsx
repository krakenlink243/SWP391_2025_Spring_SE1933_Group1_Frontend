import { Navigate } from "react-router-dom";
import MainTab from "./MainTab";
import AddFriendTab from "./AddFriendTab";
import PendingInvitesTab from "./PendingInvitesTab";
import BlockedTab from "./BlockedTab";
import { useState } from "react";
import './FriendPage.css';

function FriendsPage() {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to={"/"} replace />
    } else {
        const username = localStorage.getItem("username");
        const avatarUrl = localStorage.getItem("avatarUrl");
        const [curTab, setCurTab] = useState(0);
        const [fadeClass, setFadeClass] = useState("fade-in");

        const tabs = [<MainTab setCurTab={setCurTab} />, <AddFriendTab />, <PendingInvitesTab />, <BlockedTab />];

        const handleChangeTab = (indx) => {
            setFadeClass("fade-out");

            setTimeout(() => {
                setCurTab(indx);
                setFadeClass("fade-in");
            }, 300);
        };

        return (
            <div className="friend-page-container">
                <div className="friend-page-header d-flex flex-row align-items-center">
                    <img src={avatarUrl} alt="avatar" className="avatar" />
                    <a className="username" href="/profile">{username}</a>
                </div>
                <div className="friend-page-content d-flex flex-row">
                    <div className="content-left-nav d-flex flex-column w-25">
                        <h4 className="nav-title">Friends</h4>
                        <div
                            className={`nav-item${curTab === 0 ? " active" : ""}`}
                            onClick={() => handleChangeTab(0)}
                        >
                            Your Friends
                        </div>
                        <div
                            className={`nav-item${curTab === 1 ? " active" : ""}`}
                            onClick={() => handleChangeTab(1)}
                        >
                            Add a Friend
                        </div>
                        <div
                            className={`nav-item${curTab === 2 ? " active" : ""}`}
                            onClick={() => handleChangeTab(2)}
                        >
                            Pending Invites
                        </div>
                        <div
                            className={`nav-item${curTab === 3 ? " active" : ""}`}
                            onClick={() => handleChangeTab(3)}
                        >
                            Blocked
                        </div>
                    </div>
                    <div className={`content-right-detail w-75 ${fadeClass}`}>
                        {tabs[curTab]}
                    </div>
                </div>
            </div>
        );

    }
}

export default FriendsPage;