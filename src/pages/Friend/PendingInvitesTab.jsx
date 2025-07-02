import axios from "axios";
import { useEffect, useState } from "react";
import './PendingInvitesTab.css'
import { createNotification } from "../../services/notification";

function PendingInvitesTab() {
    const [sentInvites, setSentInvites] = useState([]);
    const [receivedInvites, setReceivedInvites] = useState([]);
    const UNKNOW_AVATAR_URL = localStorage.getItem("unknowAvatar");
    const CUR_USERNAME = localStorage.getItem("username");

    useEffect(() => {
        const getReceivedInvites = () => {
            axios.get(`${import.meta.env.VITE_API_URL}/user/pendinginvite/receive`)
                .then((response) => { setReceivedInvites(response.data) })
                .catch((err) => { console.log("Error get received Invites: " + err) });
        }
        const getSentInvites = () => {
            axios.get(`${import.meta.env.VITE_API_URL}/user/pendinginvite/init`)
                .then((response) => { setSentInvites(response.data) })
                .catch((err) => { console.log("Error get received Invites: " + err) });

        }
        getReceivedInvites();
        getSentInvites();
    }, [])

    const handleAccept = (friendId) => {
        axios.patch(`${import.meta.env.VITE_API_URL}/user/acceptinvite/${friendId}`)
            .then((resp) => {
                setReceivedInvites(prev => prev.filter(inv => inv.invitorId !== friendId));
                createNotification(friendId, "Comunity", `${CUR_USERNAME} has accepted your invites`)
            })
            .catch((err) => { console.log("Error: " + err) });
    };

    const handleBlock = (friendId) => {
        axios.patch(`${import.meta.env.VITE_API_URL}/user/blockinvite/${friendId}`)
            .then((resp) => {
                setReceivedInvites(prev => prev.filter(inv => inv.invitorId !== friendId));
            })
            .catch((err) => { console.log("Error: " + err) });
    };

    const handleDecline = (friendId) => {
        axios.delete(`${import.meta.env.VITE_API_URL}/user/declineinvite/${friendId}`)
            .then((resp) => {
                setReceivedInvites(prev => prev.filter(inv => inv.invitorId !== friendId));
            })
            .catch((err) => { console.log("Error: " + err) });
    };

    const handleCancel = (friendId) => {
        axios.delete(`${import.meta.env.VITE_API_URL}/user/declineinvite/${friendId}`)
            .then((resp) => {
                setSentInvites(prev => prev.filter(inv => inv.invitorId !== friendId));
            })
            .catch((err) => { console.log("Error: " + err) });
    };

    return (
        <div className="pending-invites-tab">
            <div className="received-invites-wrapper">
                <div className="box-title">
                    <span className="title">Received Invites</span>
                </div>
                <div className="result">
                    {receivedInvites.length == 0 && (
                        <div className="result-not-found">
                            Sorry, there are no pending friend invites to show.
                        </div>
                    )}
                    {receivedInvites.map((invite) => (
                        <div className="box-item" key={invite.invitorId}>
                            <div className="friend-box">
                                <div className="avatar">
                                    <img src={`${invite.invitorAvatarUrl ? invite.invitorAvatarUrl : UNKNOW_AVATAR_URL}`} alt={`${invite.invitorName}`} />
                                </div>
                                <div className="description">
                                    {invite.invitorName}
                                </div>
                            </div>
                            <div className="friend-actions">
                                <div className="actions-btn" onClick={() => handleAccept(invite.invitorId)}>
                                    <span>Accept</span>
                                </div>
                                <div className="actions-btn" onClick={() => handleBlock(invite.invitorId)}>
                                    <span>Block</span>
                                </div>
                                <div className="actions-btn" onClick={() => handleDecline(invite.invitorId)}>
                                    <span>Decline</span>
                                </div>
                            </div>
                        </div>
                    ))}


                </div>

            </div>
            <div className="sent-invites-wrapper">
                <div className="box-title">
                    <span className="title">Sent Invites</span>
                </div>
                <div className="result">
                    {receivedInvites.length == 0 && (
                        <div className="result-not-found">
                            Sorry, there are no pending sent invites to show.
                        </div>
                    )}
                    {sentInvites.map((invite) => (
                        <div className="box-item" key={invite.invitorId}>
                            <div className="friend-box">
                                <div className="avatar">
                                    <img src={`${invite.invitorAvatarUrl ? invite.invitorAvatarUrl : UNKNOW_AVATAR_URL}`} alt={`${invite.invitorName}`} />
                                </div>
                                <div className="description">
                                    {invite.invitorName}
                                </div>
                            </div>
                            <div className="friend-actions">
                                <div className="actions-btn" onClick={() => handleCancel(invite.invitorId)}>
                                    <span>Cancel</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default PendingInvitesTab;