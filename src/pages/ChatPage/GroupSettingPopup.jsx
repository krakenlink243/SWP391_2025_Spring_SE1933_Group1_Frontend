import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import './GroupSettingPopup.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function GroupSettingPopup({ groupSetting, setOpenPopup, setCurChat, members }) {

    const [curTab, setCurTab] = useState(0);
    const curUserId = localStorage.getItem("userId");
    const [isLeaveGroup, setIsLeaveGroup] = useState(false);
    const [kickMembers, setKickMembers] = useState([]);

    const [isGroupEmpty, setIsGroupEmpty] = useState(members.length === 1);

    const [groupMembers, setGroupMembers] = useState(members.filter(member => String(member.memberId) !== curUserId));
    useEffect(() => {
        setIsGroupEmpty(members.length === 1);
    }, [members]);

    useEffect(() => {
        setGroupMembers(members.filter(member => String(member.memberId) !== curUserId));
    }, [members, curUserId]);

    const { t } = useTranslation();
    const handleDeleteGroupChat = () => {
        if (!groupSetting.isAdmin) return;
        axios.delete(`${import.meta.env.VITE_API_URL}/user/groupchat/delete/${groupSetting.groupId}`);
        setOpenPopup(null);
        setCurChat(null);
    }

    const handleLeaveGroupChat = () => {
        if (groupSetting.isAdmin) return;
        axios.post(`${import.meta.env.VITE_API_URL}/user/groupchat/leave/${groupSetting.groupId}/${curUserId}`)
        setOpenPopup(null);
        setCurChat(null);
    }

    const handleKickMember = () => {
        if (!groupSetting.isAdmin || kickMembers.length === 0) return;
        const kickMemberIds = kickMembers.map(member => member.memberId);
        axios.post(`${import.meta.env.VITE_API_URL}/user/groupchat/kick/${groupSetting.groupId}`, kickMemberIds)
        setKickMembers([]);
    }
    const handleChangeGroupName = () => {

    }

    const subTabs = [
        (
            <div className='general-setting wrapper'>
                <div>
                    {t('Name this Chat:')}
                </div>
                <input type='text' max={100} disabled={true} />
                <Button label={t('Save')} color='gradient-blue-button' onClick={() => handleChangeGroupName()} />
            </div>
        ),
        (
            <div className='leave-group wrapper'>
                <div>
                    {t('Are you sure you want to leave this group ?')}
                </div>
                <Button label={t('Leave')} color='grey-button' onClick={() => setIsLeaveGroup(true)} />
            </div>
        ),
        (
            <div className='delete-group wrapper'>
                <div className='pb-3'>
                    Are you sure you want to delete this group ?
                    <br></br>
                    All messages and members will be <u>removed</u>.
                </div>
                <Button label={t('Delete')} color='red-button' onClick={() => handleDeleteGroupChat()} />
            </div>
        ),
        (
            <div className='kick-member wrapper'>
                <div>
                    Kick Member
                </div>
                <div>
                    <div className="form-group">
                        <label>Choosed Group Members</label>
                        <div className="selected-members-list d-flex flex-row flex-wrap align-items-center">
                            {kickMembers.map((member) => (
                                <div
                                    key={member.memberId}
                                    className="selected-member"
                                    onClick={() =>
                                        setKickMembers((prev) =>
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
                        <label>Choose Members</label>
                        <div className="member-list">
                            {groupMembers.map((member) => {
                                const isSelected = kickMembers.some((g) => g.memberId === member.memberId);
                                return (
                                    <div
                                        key={member.memberId}
                                        className={`member-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            if (isSelected) {
                                                setKickMembers((prev) =>
                                                    prev.filter((m) => m.memberId !== member.memberId)
                                                );
                                            } else {
                                                setKickMembers((prev) => [...prev, {
                                                    memberId: member.memberId,
                                                    isAdmin: false,
                                                    memberName: member.memberName,
                                                    memberAvatar: member.memberAvatar
                                                }]);
                                            }
                                        }}
                                    >
                                        <div className="avatar">
                                            <img src={member.memberAvatar}></img>
                                        </div>
                                        {member.memberName}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="d-flex flex-row justify-content-around align-items-center py-2">
                        <Button label={"Reset"} onClick={() => {
                            setKickMembers([]);
                        }
                        } color="grey-button" />
                        <Button
                            label={`Kick ${kickMembers.length} Member${kickMembers.length > 1 ? 's' : ''}`}
                            onClick={() => handleKickMember()}
                            color="gradient-blue-button"
                            disabled={isGroupEmpty || kickMembers.length === 0}
                        />
                    </div>
                </div>
            </div>
        )
    ];

    return (
        <div className="group-setting-popup-container">
            <div className='group-setting-popup-wrapper' >
                {
                    !isLeaveGroup ?
                        (
                            <div className='content'>
                                <div className='floater' onClick={() => setOpenPopup(null)}>✕</div>
                                <div className='left-col'>
                                    <div className='user-actions'>
                                        <div className="title">{t('Group Settings')}</div>

                                        <div
                                            className={`sub-item ${curTab === 0 ? "actived" : ""}`}
                                            onClick={() => setCurTab(0)}
                                        >
                                            {t('General Settings')}
                                        </div>

                                        {
                                            !groupSetting.isAdmin && (
                                                <div
                                                    className={`sub-item ${curTab === 1 ? "actived" : ""}`}
                                                    onClick={() => setCurTab(1)}
                                                >
                                                    {t('Leave Group')}
                                                </div>
                                            )
                                        }
                                        {
                                            groupSetting.isAdmin && (
                                                <div
                                                    className={`sub-item ${curTab === 2 ? "actived" : ""}`}
                                                    onClick={() => setCurTab(2)}
                                                >
                                                    {t('Delete Group')}
                                                </div>
                                            )
                                        }
                                        {
                                            groupSetting.isAdmin && (
                                                <div
                                                    className={`sub-item ${curTab == 3 ? "actived" : ""}`}
                                                    onClick={() => setCurTab(3)}
                                                >
                                                    Kick Member
                                                </div>
                                            )
                                        }
                                    </div>
                                    {
                                        !groupSetting.isAdmin && (
                                            <div className='fast-exit' onClick={() => setIsLeaveGroup(true)}>
                                                <svg
                                                    version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" enableBackground="new 0 0 64 64"><g className="Arrow"><polyline fill="none" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" stroke-miterlimit="10" points="41,30.7 14.5,30.7 23.5,19.4 "></polyline><polyline fill="none" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" stroke-miterlimit="10" points="41,30.7 14.5,30.7 23.5,42 "></polyline></g><g><polyline className="ExitDoor" stroke-linecap="round" stroke-miterlimit="1" stroke-width="2px" fill="none" points="32.5,22.1 32.5,17.7 47.7,17.7 47.7,43.8 32.5,43.8 32.5,39.5"></polyline></g></svg>
                                                {t('Leave Group Chat')}
                                            </div>
                                        )
                                    }

                                </div>
                                <div className='right-col'>
                                    {subTabs[curTab]}
                                </div>
                            </div>
                        ) : (
                            <div className='leave-group-confirmation '>
                                <div>
                                    {t('Leave Group Chat')}
                                </div>
                                <p>{t('Are you sure you want to leave this group chat?')}</p>
                                <div className='d-flex justify-content-around'>
                                    <Button label={t('Leave')} onClick={() => handleLeaveGroupChat()} color='gradient-blue-button' />
                                    <Button label={t('Cancel')} onClick={() => setIsLeaveGroup(false)} color='grey-button' />
                                </div>
                            </div>
                        )
                }
            </div>
        </div>
    );
}