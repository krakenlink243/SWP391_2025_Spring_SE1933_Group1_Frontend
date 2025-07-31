import { useContext, useState, useEffect } from 'react';
import './FamilyMemberTab.css'
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Button from '../../components/Button/Button';
import { createNotification } from '../../services/notification';

export default function FamilyMemberTab({ members, isOwner }) {

    const { t } = useTranslation();
    const { onlineUsers: online } = useContext(AppContext);
    const onlineUsers = online;

    const [isAddingNewMember, setIsAddingNewMember] = useState(false);

    const isOnline = (username) => {
        return onlineUsers.includes(username);
    }


    return (
        <div className="family-main-tab">
            <div className="family-main-tab-header d-flex flex-row justify-content-between">
                <div className="status">
                    {t('Your Family members')}
                    <span className="members-count"> {members.length} </span>
                    /
                    <span className="members-limit"> 5 </span>
                </div>
                {
                    isOwner && (
                        <div className="btn-add-member" onClick={() => setIsAddingNewMember(!isAddingNewMember)}>
                            <span>
                                <i className="icon"></i>
                                {t('Add Family members')}
                            </span>
                        </div>
                    )
                }
            </div>
            <div className="family-main-tab-body d-flex flex-row gap-2 flex-wrap">
                {!isAddingNewMember && members.length == 0 && <div>{t('You have no members')}</div>}
                {
                    !isAddingNewMember && members.map((m) => (
                        <div
                            key={m.id}
                            className={`member-item d-flex flex-row align-items-center ${isOnline(m.name) ? "online" : "offline"} ${m.isOwner ? "owner" : ""}`}
                            onClick={() => navigate(`/profile/${m.id}`)}
                        >
                            <div className="member-avatar">
                                <img
                                    src={m.avatar}
                                    alt={m.name}
                                />
                            </div>
                            <div className={`spacer`}></div>
                            <div className="member-name">{m.name}</div>
                        </div>
                    ))
                }
                {
                    isAddingNewMember && <AddMembersForm members={members} setOpenPopup={() => setIsAddingNewMember(!isAddingNewMember)} />
                }

            </div>
        </div>
    );
}

function AddMembersForm({ members, setOpenPopup }) {
    const [newGMembers, setNewGMembers] = useState([]);
    const { friendList } = useContext(AppContext);
    const [isFamilyFull, setIsFamilyFull] = useState(false);
    const { t } = useTranslation();
    const [availableFriends, setAvailableFriends] = useState([]);
    const [isSendingInvite, setIsSendingInvite] = useState(false);

    useEffect(() => {
        setIsFamilyFull((members.length + newGMembers.length) >= 5);
    }, [members, newGMembers]);


    useEffect(() => {
        fetchAvailableFriends();
    }, []);

    const fetchAvailableFriends = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/api/family/available-friends`, friendList.map(friend => friend.friendId)).then((response) => {
            const data = response.data.data;
            setAvailableFriends(friendList.filter(friend => data.includes(friend.friendId)));
        }).catch((error) => {
            console.error("Error fetching available friends:", error);
        });
    }


    const handleSendInvite = () => {
        if (isFamilyFull || newGMembers.length === 0)
            return;
        setIsSendingInvite(true);
        axios.post(`${import.meta.env.VITE_API_URL}/api/family/invite`, newGMembers.map(member => member.memberId))
            .then((response) => {
                console.log("Invitation sent successfully:", response.data);

                newGMembers.forEach(member => {
                    createNotification(member.memberId, "FAMILY_INVITATION", `You have been invited to join the family by ${localStorage.getItem("username")}`);
                });

                setNewGMembers([]);
                setOpenPopup();
            })
            .catch((error) => {
                console.error("Error sending invitation:", error);
            })
            .finally(() => {
                setIsSendingInvite(false);
            });
    }
    return (
        <div className="family-add-member-popup-container d-flex flex-column w-100">
            <div className="popup-wrapper d-flex flex-column gap-3">
                <div className="title">
                    {t('Send invitation to friends to join family')}
                </div>
                {
                    isFamilyFull && (
                        <div className="warning-message">
                            Number of members in this family has reached the limit of 5. Please remove some members before adding new ones.
                        </div>
                    )
                }

                {/* Group Members selected */}
                <div className="form-group">
                    <label>{t('Family Members')}</label>
                    <div className="selected-members-list d-flex flex-row flex-wrap align-items-center">
                        {newGMembers.map((member) => (
                            <div
                                key={member.memberId}
                                className="selected-member"
                                onClick={() =>
                                    setNewGMembers((prev) =>
                                        prev.filter((m) => m.memberId !== member.memberId)
                                    )
                                }
                            >
                                <span className="selected-member-name">{member.memberName}</span>
                                ✕
                            </div>
                        ))}
                    </div>
                </div>

                {/* Friend list to choose */}
                <div className="form-group">
                    <label>{t('Choose Friends')}</label>
                    <div className="friend-list">
                        {availableFriends.map((friend) => {
                            const isSelected = newGMembers.some((m) => m.memberId === friend.friendId);
                            return (
                                <div
                                    key={friend.friendId}
                                    className={`friend-item ${isSelected ? 'selected' : ''} ${isFamilyFull ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (isSelected) {
                                            setNewGMembers((prev) =>
                                                prev.filter((m) => m.memberId !== friend.friendId)
                                            );
                                        } else if (!isFamilyFull) {
                                            setNewGMembers((prev) => [...prev, {
                                                memberId: friend.friendId,
                                                memberName: friend.friendName,
                                                memberAvatar: friend.friendAvatarUrl
                                            }]);
                                        }
                                    }}
                                >
                                    <div className="avatar">
                                        <img src={friend.friendAvatarUrl}></img>
                                    </div>
                                    {friend.friendName}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="d-flex flex-row justify-content-around align-items-center py-2">
                    <Button label={t('Cancel')} onClick={() => {
                        setNewGMembers([]);
                        setOpenPopup();
                    }
                    } color="grey-button" />
                    <Button label={"Send Invitation"} onClick={() => handleSendInvite()} color="gradient-blue-button" disabled={isFamilyFull || newGMembers.length === 0}
                        loading={isSendingInvite}
                    />
                </div>
            </div>
        </div>
    );
}