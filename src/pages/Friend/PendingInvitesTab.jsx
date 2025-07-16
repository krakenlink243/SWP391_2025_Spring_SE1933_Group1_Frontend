import axios from "axios";
import { useEffect, useState } from "react";
import './PendingInvitesTab.css'
import { createNotification } from "../../services/notification";
import { useAuth } from "../../context/AuthContext";
import { useFriendInvite } from "../../hooks/useFriendInvite";

function PendingInvitesTab() {
    const CUR_USERNAME = localStorage.getItem("username");
    const { token } = useAuth();
    const {
        sentInvites,
        receivedInvites,
        setSentInvites,
        setReceivedInvites
    } = useFriendInvite(token);

    const handleAccept = (friendId) => {
        axios.patch(`${import.meta.env.VITE_API_URL}/user/acceptinvite/${friendId}`)
            .then((resp) => {
                setReceivedInvites(prev => prev.filter(inv => inv.senderId !== friendId));
                createNotification(friendId, "Comunity", `${CUR_USERNAME} has accepted your invites`)
            })
            .catch((err) => { console.log("Error: " + err) });
    };

    const handleBlock = (friendId) => {
        axios.patch(`${import.meta.env.VITE_API_URL}/user/block/${friendId}`)
            .then((resp) => {
                setReceivedInvites(prev => prev.filter(inv => inv.senderId !== friendId));
            })
            .catch((err) => { console.log("Error: " + err) });
    };

    const handleDecline = (friendId) => {
        axios.delete(`${import.meta.env.VITE_API_URL}/user/declineinvite/${friendId}`)
            .then((resp) => {
                setReceivedInvites(prev => prev.filter(inv => inv.senderId !== friendId));
            })
            .catch((err) => { console.log("Error: " + err) });
    };

    const handleCancel = (friendId) => {
        axios.delete(`${import.meta.env.VITE_API_URL}/user/cancelinvite/${friendId}`)
            .then((resp) => {
                setSentInvites(prev => prev.filter(inv => inv.receiverId !== friendId));
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
                        <div className="box-item" key={invite.senderId}>
                            <div className="friend-box">
                                <div className="avatar">
                                    <img src={`${invite.senderAvatar}`} alt={`${invite.senderName}`} />
                                </div>
                                <div className="description">
                                    {invite.senderName}
                                </div>
                            </div>
                            <div className="friend-actions">
                                <div className="actions-btn" onClick={() => handleAccept(invite.senderId)}>
                                    <span>Accept</span>
                                </div>
                                <div className="actions-btn" onClick={() => handleBlock(invite.senderId)}>
                                    <span>Block</span>
                                </div>
                                <div className="actions-btn" onClick={() => handleDecline(invite.senderId)}>
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
                    {sentInvites.length == 0 && (
                        <div className="result-not-found">
                            Sorry, there are no pending sent invites to show.
                        </div>
                    )}
                    {sentInvites.map((invite) => (
                        <div className="box-item" key={invite.receiverId}>
                            <div className="friend-box">
                                <div className="avatar">
                                    <img src={`${invite.receiverAvatar}`} alt={`${invite.receiverName}`} />
                                </div>
                                <div className="description">
                                    {invite.receiverName}
                                </div>
                            </div>
                            <div className="friend-actions">
                                <div className="actions-btn" onClick={() => handleCancel(invite.receiverId)}>
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