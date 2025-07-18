import { useEffect, useState } from "react";
import Split from "split.js";
import ChatBodyLeft from "./ChatBodyLeft";
import ChatBodyRight from "./ChatBodyRight";
import './ChatBody.css';
import Button from "../../components/Button/Button";
import axios from "axios";

function ChatBody({ bodyH }) {

    const [curChat, setCurChat] = useState(null);

    const [openPopup, setOpenPopup] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [newGMembers, setNewGMembers] = useState([]);

    const [friendList, setFriendList] = useState([]);
    const [groupChats, setGroupChats] = useState([]);

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

    useEffect(() => {
        getFriendList();
        getGroupChatList();
    }, [])



    const getFriendList = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/user/friends`)
            .then((response) => { setFriendList(response.data) })
            .catch((err) => { console.log("Error fetching friends list: " + err) })
    };

    const getGroupChatList = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/user/groupchat`)
            .then((response) => {
                setGroupChats(response.data.data);
                console.log("Group: ", response.data.data);
            })
            .catch((err) => { console.log("Error: ", err) })
    }

    const handleAddGroupChat = () => {
        axios.post(`${import.meta.env.VITE_API_URL}/user/groupchat/add`, {
            groupName: newGroupName,
            members: newGMembers
        })
            .then((response) => {
                setGroupChats((value) => {
                    return [...value, response.data.data];
                })
            })
            .catch((error) => { console.log("Error creating Group: ", error) })
        setNewGMembers([]);
        setNewGroupName("");
        setOpenPopup(false);
    }

    const handleCancel = () => {
        setOpenPopup(false);
        setNewGMembers([]);
        setNewGroupName("");
    }

    return (
        <div className="chat-main split d-flex flex-row p-0" style={{ height: `${bodyH}px` }}>
            {
                openPopup && (
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
                                            key={member.friendId}
                                            className="selected-member badge"
                                            onClick={() =>
                                                setNewGMembers((prev) =>
                                                    prev.filter((m) => m.id !== member.id)
                                                )
                                            }
                                        >
                                            {member.friendName} ✕
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Friend list to choose */}
                            <div className="form-group">
                                <label>Choose Friends</label>
                                <div className="friend-list">
                                    {friendList.map((friend) => {
                                        const isSelected = newGMembers.some((m) => m.friendId === friend.friendId);
                                        return (
                                            <div
                                                key={friend.friendId}
                                                className={`friend-item ${isSelected ? 'selected' : ''}`}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setNewGMembers((prev) =>
                                                            prev.filter((m) => m.id !== friend.friendId)
                                                        );
                                                    } else {
                                                        setNewGMembers((prev) => [...prev, friend]);
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
            <ChatBodyLeft
                setCurChat={setCurChat}
                setOpenPopup={setOpenPopup}
                friendList={friendList}
                groupChats={groupChats}
            />
            <ChatBodyRight
                curChat={curChat}
            />

        </div>
    );
}

export default ChatBody;