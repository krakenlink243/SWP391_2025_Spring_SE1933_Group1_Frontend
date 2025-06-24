import axios from "axios";
import './AddFriendTab.css'
import { useEffect, useState } from "react";
import { createNotification } from "../../services/notification";

function AddFriendTab() {

    const userId = localStorage.getItem("userId");
    const curUsername = localStorage.getItem("username");
    const [searchFriendCode, setSearchFriendCode] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [friendList, setFriendList] = useState([]);
    const [sentInvites, setSentInvites] = useState([]);
    const [copied, setCopied] = useState(false);

    const getFriendList = () => {
        axios.get("http://localhost:8080/user/friends")
            .then((response) => { setFriendList(response.data) })
            .catch((err) => { console.log("Error fetching friends list: " + err) })
    };

    const handleSendInvite = (friendId) => {
        axios.post(`http://localhost:8080/user/sendinvite/${friendId}`)
            .then((response) => {
                createNotification(friendId, "Friend", `${curUsername} send you an invite`);
                setSentInvites(prev => [...prev, { receiverId: friendId }]);
            })
            .catch((err) => { console.log("Error sending invite: " + err) });
    };

    const handleSearchFriend = (friendId) => {
        if (!friendId) {
            setSearchResult(null);
        }

        axios.get(`http://localhost:8080/user/find/${friendId}`)
            .then((resp) => { setSearchResult(resp.data) })
            .catch(() => {
                setSearchResult(null);
            })
    };

    const getSentInvites = () => {
        axios.get("http://localhost:8080/user/pendinginvite/init")
            .then((response) => { setSentInvites(response.data) })
            .catch((err) => { console.log("Error get received Invites: " + err) });

    }

    function handleCheckFriend(friendId) {
        return friendList.some(friend => friend.friendId === friendId);
    }
    function handleCheckSentInvite(friendId) {
        return sentInvites.some(invite => invite.receiverId === friendId);
    }


    useEffect(() => {
        getFriendList();
        getSentInvites();
    }, [])

    useEffect(() => {
        if (!searchFriendCode) {
            setSearchResult(null);
            return;
        }
        const handler = setTimeout(() => {
            handleSearchFriend(searchFriendCode);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchFriendCode]);


    return (
        <div className="add-friend-tab">
            <div className="add-friend-box">
                <div className="title">
                    Add A Friend
                </div>
                <div className="content">
                    <div className="user-code-wrapper">
                        <div className="user-code-title">
                            Your Friend Code
                        </div>
                        <div className="user-code-box d-flex flex-row justify-content-between align-items-center">
                            <div className="user-code">
                                {userId}
                            </div>
                            <div
                                className="copy-btn"
                                onClick={() => {
                                    navigator.clipboard.writeText(userId);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 800);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                {copied ? "Copied" : "Copy"}
                            </div>
                        </div>
                    </div>
                    <div className="enter-friend-code-wrapper">
                        <div className="enter-friend-code-title">
                            Enter your friend's Friend Code to invite them to connect
                        </div>
                        <div className="enter-friend-code-input-box d-flex flex-column">
                            <input
                                type="text"
                                placeholder="Enter a Friend Code"
                                value={searchFriendCode}
                                onChange={(e) => {
                                    setSearchFriendCode(e.target.value);
                                }}
                            />
                        </div>
                        <div
                            className="search-result-box d-flex flex-row justify-content-between align-items-center"
                            style={{
                                opacity: searchResult ? 1 : 0,
                                pointerEvents: searchResult ? 'auto' : 'none',
                                transition: 'opacity 0.3s'
                            }}
                        >
                            {searchResult && (
                                <>
                                    <div className="search-result-user d-flex flex-row">
                                        <div className="search-result-avatar">
                                            <img
                                                src={searchResult.avatarUrl ? searchResult.avatarUrl : "https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"}
                                                alt={searchResult.username}
                                            />
                                        </div>
                                        <div className="search-result-information">
                                            <h1>{searchResult.username}</h1>
                                        </div>
                                    </div>
                                    {handleCheckFriend(searchResult.userId) || handleCheckSentInvite(searchResult.userId) ? (
                                        <div className="send-invite-btn btn-disable">
                                            Send Invite
                                        </div>
                                    ) : (
                                        <div
                                            className="send-invite-btn btn-active"
                                            onClick={() => handleSendInvite(searchResult.userId)}
                                        >
                                            Send Invite
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddFriendTab;