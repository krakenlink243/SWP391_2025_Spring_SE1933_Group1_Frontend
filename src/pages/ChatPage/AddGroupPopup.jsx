import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Button from "../../components/Button/Button";
import axios from "axios";
import './AddGroupPopup.css';
import { useTranslation } from "react-i18next";

export default function AddGroupPopup({ setOpenPopup }) {

    const [newGroupName, setNewGroupName] = useState("");
    const [newGMembers, setNewGMembers] = useState([]);
    const { friendList, groupChats } = useContext(AppContext);
    const isGroupFull = groupChats.length >= 10;
    const isBanned = localStorage.getItem("isBanned") === "true";

    const [isHover, setIsHover] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const filteredFriends = friendList.filter(friend =>
        friend.friendName.toLowerCase().includes(searchKeyword.toLowerCase())
    );


    // const isGroupFull = true;
    const { t } = useTranslation();

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
                    {t('Create Group Chat')}
                </div>
                <div className="warning-text">
                    {isGroupFull ? t('You have reached the maximum number of groups.') : ''}
                </div>

                <div className="form-group">
                    <label>{t('Group Name')}</label>
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
                    <div className="d-flex flex-row align-items-center justify-content-between py-2">
                        <label>{t('Choose Friends')}</label>
                        <div className="d-flex flex-row align-items-center">
                            <div className={`search-friend-bar h-100`}
                                style={{ opacity: isHover ? "1" : "0" }}
                                onMouseEnter={() => setIsHover(true)}
                                onMouseLeave={() => (
                                    searchKeyword === "" && setIsHover(false)
                                )}
                            >
                                <div className="search-bar d-flex flex-row justify-content-center align-items-center h-100"
                                    style={{ pointerEvents: isHover ? "auto" : "none" }}

                                >
                                    <input
                                        type="text"
                                        placeholder="search friend"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    >
                                    </input>

                                </div>
                            </div>
                            <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ padding: '5px', width: '30px' }} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => (searchKeyword === "" && setIsHover(false))}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path clip-rule="evenodd" d="M12.2852 4.05704C7.74092 4.05704 4.05704 7.74092 4.05704 12.2852C4.05704 16.8295 7.74092 20.5134 12.2852 20.5134C16.8295 20.5134 20.5134 16.8295 20.5134 12.2852C20.5134 7.74092 16.8295 4.05704 12.2852 4.05704ZM2 12.2852C2 6.60485 6.60485 2 12.2852 2C17.9656 2 22.5704 6.60485 22.5704 12.2852C22.5704 17.9656 17.9656 22.5704 12.2852 22.5704C6.60485 22.5704 2 17.9656 2 12.2852Z" fill="#fcfcfc" fill-rule="evenodd"></path><path d="M19.8786 18.3487L25.6829 24.153C26.1057 24.5758 26.1057 25.2613 25.6829 25.6841C25.2601 26.1069 24.5746 26.1069 24.1518 25.6841L18.3475 19.8798L19.8786 18.3487Z" fill="#fcfcfc"></path></g></svg>

                        </div>
                    </div>
                    <div className="friend-list">
                        {searchKeyword === "" && friendList.map((friend) => {
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
                        {
                            searchKeyword !== "" && filteredFriends.map((friend) => {
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
                            })
                        }
                    </div>
                </div>

                <div className="d-flex flex-row justify-content-around align-items-center py-2">
                    <Button label={t('Cancel')} onClick={() => {
                        setNewGMembers([]);
                        setNewGroupName("");
                        setOpenPopup(false);
                        setSearchKeyword("");
                    setIsHover(false);
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