import axios from "axios";
import './AddFriendTab.css'
import { useContext, useEffect, useState } from "react";
import { createNotification } from "../../services/notification";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/AppContext";

function AddFriendTab() {

    const CUR_USER_ID = localStorage.getItem("userId");
    const curUsername = localStorage.getItem("username");
    const [searchFriendCode, setSearchFriendCode] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const { t } = useTranslation();
    const [friendList, setFriendList] = useState([]);
    const [sentInvitesList, setSentInvitesList] = useState([]);

    const { blockedList: blockList } = useContext(AppContext);

    const [copied, setCopied] = useState(false);
    const UNKNOW_AVATAR_URL = localStorage.getItem("unknowAvatar");


    const getFriendList = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/user/friends`)
            .then((response) => { setFriendList(response.data) })
            .catch((err) => { console.log("Error fetching friends list: " + err) })
    };

    const getSentInvitesList = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/user/pendinginvite/init`)
            .then((response) => { setSentInvitesList(response.data.data) })
            .catch((err) => { console.log("Error get received Invites: " + err) });

    }

    const handleSendInvite = (friendId) => {
        axios.post(`${import.meta.env.VITE_API_URL}/user/sendinvite/${friendId}`)
            .then((response) => {
                createNotification(friendId, "Friend", `${curUsername} send you an invite`);
                setSentInvitesList(prev => [...prev, { receiverId: friendId }]);
            })
            .catch((err) => { console.log("Error sending invite: " + err) });
    };

    const handleSearchFriend = (friendId) => {
        if (!friendId) {
            setSearchResult(null);
        }

        axios.get(`${import.meta.env.VITE_API_URL}/user/find/${friendId}`)
            .then((resp) => { setSearchResult(resp.data) })
            .catch(() => {
                setSearchResult(null);
            })
    };

    function handleCheckFriend(friendId) {
        return friendList.some(friend => friend.friendId === friendId) || friendId == CUR_USER_ID;
    }

    function handleCheckSentInvite(friendId) {
        return sentInvitesList.some(invite => invite.receiverId === friendId);
    }

    function handleCheckBlockFriend(otherId) {
        const curUserId = Number(localStorage.getItem("userId"));
        return blockList.some(blckUser =>
            (blckUser.blockerId === curUserId && blckUser.blockedId === otherId) ||  // bạn đã block họ
            (blckUser.blockerId === otherId && blckUser.blockedId === curUserId)    // họ block bạn
        );
    }

    useEffect(() => {
        getFriendList();
        getSentInvitesList();
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
                    {t('Add A Friend')}
                </div>
                <div className="content">
                    <div className="user-code-wrapper">
                        <div className="user-code-title">
                            {t('Your Friend Code')}
                        </div>
                        <div className="user-code-box d-flex flex-row justify-content-between align-items-center">
                            <div className="user-code">
                                {CUR_USER_ID}
                            </div>
                            <div
                                className="copy-btn"
                                onClick={() => {
                                    navigator.clipboard.writeText(CUR_USER_ID);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 800);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                {copied ? t('Copied') : t('Copy')}
                            </div>
                        </div>
                    </div>
                    <div className="enter-friend-code-wrapper">
                        <div className="enter-friend-code-title">
                            {t(`Enter your friend's Friend Code to invite them to connect`)}
                        </div>
                        <div className="enter-friend-code-input-box d-flex flex-column">
                            <input
                                type="text"
                                placeholder={t('Enter a Friend Code')}
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
                                                src={searchResult.avatarUrl ? searchResult.avatarUrl : UNKNOW_AVATAR_URL}
                                                alt={searchResult.username}
                                            />
                                        </div>
                                        <div className="search-result-information">
                                            <h1>{searchResult.username}</h1>
                                        </div>
                                    </div>
                                    {(searchResult &&
                                        (handleCheckFriend(searchResult.userId) ||
                                            handleCheckSentInvite(searchResult.userId) ||
                                            handleCheckBlockFriend(searchResult.userId))) ? (
                                        <div className="send-invite-btn btn-disable">
                                            {t('Send Invite')}
                                        </div>
                                    ) : (
                                        <div
                                            className="send-invite-btn btn-active"
                                            onClick={() => handleSendInvite(searchResult.userId)}
                                        >
                                            {t('Send Invite')}
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