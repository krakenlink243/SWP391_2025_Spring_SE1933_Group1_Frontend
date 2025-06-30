import { useEffect, useState } from "react";
import './BlockedTab.css';
import axios from "axios";

function BlockedTab() {

    const [blockedList, setBlockedList] = useState([]);
    const UNKNOW_AVATAR_URL = localStorage.getItem("unknowAvatar");

    const getblockedList = () => {
        axios.get("http://localhost:8080/user/blocked")
            .then((response) => { setBlockedList(response.data) })
            .catch((err) => { console.log("Error fetching friends list: " + err) })
    };

    useEffect(() => {
        getblockedList();
    }, []);

    return (
        <div className="blocked-tab">
            <div className="blocked-tab-header">
                <div className="status">
                    Blocked
                </div>
            </div>
            <div className="blocked-tab-body d-flex flex-row gap-2 flex-wrap">
                {blockedList.length == 0 && (
                    <div className="result-not-found">Sorry, there are no blocked players to show.</div>
                )}
                {
                    blockedList.map((blckU, idx) => (
                        <div key={blckU.friendId} className="blocked-user-item d-flex flex-row gap-2 align-items-center">
                            <div className="blocked-user-avatar">
                                <img
                                    src={blckU.friendAvatarUrl ? blckU.friendAvatarUrl : UNKNOW_AVATAR_URL}
                                    alt={blckU.friendName}
                                />
                            </div>
                            <div className="d-flex flex-column" style={{ flexGrow: 1 }}>
                                <div className="blocked-user-name">{blckU.friendName}</div>
                                <div className="blocked-user-badge">Blocked</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );

};
export default BlockedTab;