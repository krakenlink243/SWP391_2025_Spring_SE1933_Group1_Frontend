import { useContext, useEffect, useState } from "react";
import Split from "split.js";
import ChatBodyLeft from "./ChatBodyLeft";
import ChatBodyRight from "./ChatBodyRight";
import './ChatBody.css';
import Button from "../../components/Button/Button";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import GroupSettingPopup from "./GroupSettingPopup";

function ChatBody({ bodyH }) {

    const [curChat, setCurChat] = useState(null);

    const [openAddGroupPopup, setOpenAddGroupPopup] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [newGMembers, setNewGMembers] = useState([]);

    const [openGroupSettingPopup, setOpenGroupSettingPopup] = useState(false);

    const { friendList } = useContext(AppContext);

    useEffect(() => {

        const split = Split(['#left-pane', '#right-pane'], {
            sizes: [20, 80],
            minSize: 200,
            maxSize: [440, Infinity],
            gutterSize: 5,
            direction: 'horizontal',
        });

        return () => split.destroy()
    }, [])

    const handleAddGroupChat = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/user/groupchat/add`, {
            groupName: newGroupName,
            members: newGMembers
        })
            .catch((error) => { console.log("Error creating Group: ", error) })
        setNewGMembers([]);
        setNewGroupName("");
        setOpenAddGroupPopup(false);
    }

    const handleDeleteGroupChat = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/user/groupchat/delete`);
        setOpenGroupSettingPopup(false);
    }

    const handleCancel = () => {
        setOpenAddGroupPopup(false);
        setNewGMembers([]);
        setNewGroupName("");
    }

    return (
        <div className="chat-main split d-flex flex-row p-0" style={{ height: `${bodyH}px` }}>
            {
                openAddGroupPopup && (
                    <div className="add-group-popup-container d-flex flex-column">
                        <div className="popup-wrapper d-flex flex-column gap-3">
                            <div className="title">
                                Create Group
                            </div>

                            <div className="form-group">
                                <label>Group Name</label>
                                <input
                                    type="text"
                                    max={100}
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                ></input>
                            </div>

                            {/* Group Members selected */}
                            <div className="form-group">
                                <label>Group Members</label>
                                <div className="selected-members-list d-flex flex-wrap">
                                    {newGMembers.map((member) => (
                                        <div
                                            key={member.memberId}
                                            className="selected-member badge"
                                            onClick={() =>
                                                setNewGMembers((prev) =>
                                                    prev.filter((m) => m.memberId !== member.memberId)
                                                )
                                            }
                                        >
                                            {member.memberName} ✕
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
                                <Button label={"Cancel"} onClick={() => handleCancel()} color="white-grey-button" />
                                <Button label={"Create Group"} onClick={() => handleAddGroupChat()} color="gradient-blue-button" />
                            </div>
                        </div>
                    </div>
                )
            }
            {openGroupSettingPopup && (
                <GroupSettingPopup 
                    setOpenPopup={setOpenGroupSettingPopup}
                />
            )

            }
            <ChatBodyLeft
                setCurChat={setCurChat}
                setOpenPopup={setOpenAddGroupPopup}
            />
            <ChatBodyRight
                curChat={curChat}
                setOpenPopup={setOpenGroupSettingPopup}
            />

        </div>
    );
}

export default ChatBody;