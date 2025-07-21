import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import Button from "../../components/Button/Button";
import axios from "axios";
import './AddMemberPopup.css'
import { useTranslation } from "react-i18next";

export default function AddMemberPopup({ setOpenPopup, groupId, groupMembers }) {
    const [newGMembers, setNewGMembers] = useState([]);
    const { friendList } = useContext(AppContext);
<<<<<<< HEAD
    const isBanned = localStorage.getItem("isBanned") === "true";
    const [isGroupFull, setIsGroupFull] = useState(false);

    useEffect(() => {
        setIsGroupFull((groupMembers.length + newGMembers.length) > 50);
    }, [groupMembers, newGMembers]);

    // const isGroupFull = true;
    // const isBanned = true;
=======
    const { t } = useTranslation();
>>>>>>> bathanh

    const availableFriend = friendList.filter(
        (friend) => !groupMembers.some((member) => member.memberId === friend.friendId && friend.groupsTakeIn < 10)
    );


    const handleAddMembers = () => {
        if (isGroupFull || newGMembers.length === 0 || isBanned)
            return;
        axios.post(`${import.meta.env.VITE_API_URL}/user/groupchat/join/${groupId}`, newGMembers);
        setNewGMembers([]);
        setOpenPopup(false);
    }

    return (
        <div className="add-member-popup-container d-flex flex-column">
            <div className="popup-wrapper d-flex flex-column gap-3">
                <div className="title">
                    {t('Add Member to Group Chat')}
                </div>
                {
                    isGroupFull && (
                        <div className="warning-message">
                            Number of members in this group has reached the limit of 50. Please remove some members before adding new ones.
                        </div>
                    )
                }
                {
                    isBanned && (
                        <div className="warning-message">
                            You are currently banned. Please contact through Feedback or Email to unban.
                        </div>
                    )
                }

                {/* Group Members selected */}
                <div className="form-group">
                    <label>{t('Group Members')}</label>
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
                        {availableFriend.map((friend) => {
                            const isSelected = newGMembers.some((m) => m.memberId === friend.friendId);
                            return (
                                <div
                                    key={friend.friendId}
                                    className={`friend-item ${isSelected ? 'selected' : ''} ${isGroupFull || isBanned ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (isSelected) {
                                            setNewGMembers((prev) =>
                                                prev.filter((m) => m.memberId !== friend.friendId)
                                            );
                                        } else if (!isGroupFull && !isBanned) {
                                            setNewGMembers((prev) => [...prev, {
                                                memberId: friend.friendId,
                                                isAdmin: false,
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
                        setOpenPopup(false);
                    }
                    } color="grey-button" />
<<<<<<< HEAD
                    <Button label={"Add Members"} onClick={() => handleAddMembers()} color="gradient-blue-button" disabled={isBanned || isGroupFull || newGMembers.length === 0} />
=======
                    <Button label={t('Add Members')} onClick={() => handleAddMembers()} color="gradient-blue-button" />
>>>>>>> bathanh
                </div>
            </div>
        </div>
    );
}