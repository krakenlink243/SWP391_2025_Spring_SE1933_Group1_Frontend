import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Button from "../../components/Button/Button";
import axios from "axios";
import './AddGroupPopup.css';

export default function AddGroupPopup({ setOpenPopup }) {

    const [newGroupName, setNewGroupName] = useState("");
    const [newGMembers, setNewGMembers] = useState([]);
    const { friendList, groupChats } = useContext(AppContext);
    const isGroupFull = groupChats.length >= 10;
    const isBanned = localStorage.getItem("isBanned") === "true";
    // const isGroupFull = true;

    const handleAddGroupChat = () => {
        if (isGroupFull) {
            return;
        }
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
                    Create Group Chat
                </div>

                <div className="form-group">
                    <label>Group Name</label>
                    <input
                        type="text"
                        maxLength={100}
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        disabled={isGroupFull || isBanned}
                    ></input>
                </div>

                {/* Group Members selected */}
                <div className="form-group">
                    <label>Group Members</label>
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
                    <label>Choose Friends</label>
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
                    <Button label={"Cancel"} onClick={() => {
                        setNewGMembers([]);
                        setNewGroupName("");
                        setOpenPopup(false);
                    }
                    } color="grey-button" />
                    <Button
                        label={`Create Group`}
                        onClick={() => handleAddGroupChat()}
                        color="gradient-blue-button"
                        disabled={isGroupFull || isBanned || newGroupName.trim() === "" || newGMembers.length === 0}
                    />
                </div>
            </div>
        </div>
    );
}