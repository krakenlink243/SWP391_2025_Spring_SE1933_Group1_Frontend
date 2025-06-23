import { useState, useEffect } from "react";
import axios from "axios";

function MainTab() {
    const [friendList, setFriendList] = useState([]);

    const getFriendList = () => {
        axios.get("http://localhost:8080/user/friends")
            .then((response) => { setFriendList(response.data) })
            .catch((err) => { console.log("Error fetching friends list: " + err) })
    };

    useEffect(() => {
        getFriendList();
    }, [])

    return (
        <div className="main-tab">
            <div className="main-tab-header d-flex flex-row justify-content-between">
                <div className="status">
                    Your Friends
                    <span className="friends-count">{friendList.length}</span>
                    /
                    <span className="friends-limit">285</span>
                </div>
                <div className="btn-add-friend">
                    Add a Friend
                </div>
            </div>
            <div className="main-tab-body">
                {friendList.length == 0 && <div>You have no friends</div>}
                {
                    friendList.map((friend, idx) => (
                        <div key={friend.friendId} className="friend-item">
                            <img
                                src={friend.friendAvatarUrl}
                                alt={friend.friendName}
                                className="friend-avatar"
                                style={{ width: 40, height: 40, borderRadius: "50%" }}
                            />
                            <span className="friend-name">{friend.friendName}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
export default MainTab;