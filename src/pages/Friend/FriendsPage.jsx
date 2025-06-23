import { Navigate } from "react-router-dom";
import MainTab from "./MainTab";
import AddFriendTab from "./AddFriendTab";
import PendingInvitesTab from "./PendingInvitesTab";
import BlockedTab from "./BlockedTab";
import { useState } from "react";


function FriendsPage() {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to={"/"} replace />
    } else {
        const username = localStorage.getItem("username");
        const avatarUrl = localStorage.getItem("avatarUrl");
        const [curTab, setCurTab] = useState(0);

        const tabs = [<MainTab />, <AddFriendTab />, <PendingInvitesTab />, <BlockedTab />];

        return (
            <div className="friend-page-container text-white">
                <div className="friend-page-header d-flex flex-row" style={{height:"127px"}}>
                    <img src={avatarUrl} alt="avatar" className="avatar" />
                    <span className="username">{username}</span>
                </div>
                <div className="friend-page-content d-flex flex-row">
                    <div className="content-left-nav d-flex flex-column w-25">
                        <div className="nav-title">Friends</div>
                        <div
                            className={`nav-item${curTab === 0 ? " active" : ""}`}
                            onClick={() => setCurTab(0)}
                        >
                            Your Friends
                        </div>
                        <div
                            className={`nav-item${curTab === 1 ? " active" : ""}`}
                            onClick={() => setCurTab(1)}
                        >
                            Add a Friend
                        </div>
                        <div
                            className={`nav-item${curTab === 2 ? " active" : ""}`}
                            onClick={() => setCurTab(2)}
                        >
                            Pending Invites
                        </div>
                        <div
                            className={`nav-item${curTab === 3 ? " active" : ""}`}
                            onClick={() => setCurTab(3)}
                        >
                            Blocked
                        </div>
                    </div>
                    <div className="content-right-detail w-75">
                        {tabs[curTab]}
                    </div>
                </div>
            </div>
        );

    }
}

export default FriendsPage;