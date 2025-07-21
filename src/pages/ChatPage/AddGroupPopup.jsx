import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Button from "../../components/Button/Button";
import axios from "axios";
import './AddGroupPopup.css';
import { useTranslation } from "react-i18next";

export default function AddGroupPopup({ setOpenPopup }) {

    const [newGroupName, setNewGroupName] = useState("");
    const [newGMembers, setNewGMembers] = useState([]);
    const { friendList } = useContext(AppContext);
    const { t } = useTranslation();

    const handleAddGroupChat = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/user/groupchat/add`, {
            groupName: newGroupName,
            members: newGMembers
        })
            .catch((error) => { console.log("Error creating Group: ", error) })
        setNewGMembers([]);
        setNewGroupName("");
        setOpenPopup(false);
    }



    return (
        <div className="add-group-popup-container d-flex flex-column">
            <div className="popup-wrapper d-flex flex-column gap-3">
                <div className="title">
                    {t('Create Group Chat')}
                </div>

                <div className="form-group">
                    <label>{t('Group Name')}</label>
                    <input
                        type="text"
                        max={100}
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                    ></input>
                </div>

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
                        {friendList.map((friend) => {
                            const isSelected = newGMembers.some((m) => m.memberId === friend.friendId);
                            return (
                                <div
                                    key={friend.friendId}
                                    className={`friend-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (isSelected) {
                                            setNewGMembers((prev) =>
                                                prev.filter((m) => m.memberId !== friend.friendId)
                                            );
                                        } else {
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
                        setNewGroupName("");
                        setOpenPopup(false);
                    }
                    } color="grey-button" />
                    <Button label={t('Create Group')} onClick={() => handleAddGroupChat()} color="gradient-blue-button" />
                </div>
            </div>
        </div>
    );
}