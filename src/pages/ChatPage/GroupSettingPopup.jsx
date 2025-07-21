import { useState } from 'react';
import Button from '../../components/Button/Button';
import './GroupSettingPopup.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function GroupSettingPopup({ groupSetting, setOpenPopup, setCurChat }) {

    const [curTab, setCurTab] = useState(0);
    const curUserId = localStorage.getItem("userId");
    const [isLeaveGroup, setIsLeaveGroup] = useState(false);
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

    const handleChangeGroupName = () => {

    }

    const subTabs = [
        (
            <div className='general-setting wrapper'>
                <div>
                    {t('Name this Chat:')}
                </div>
                <input type='text' max={100} />
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
                <div>
                    {t('Are you sure you want to delete this group ?')}
                </div>
                <Button label={t('Delete')} color='red-button' onClick={() => handleDeleteGroupChat()} />
            </div>
        ),
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
                                                    className={`sub-item ${curTab[2] ? "actived" : ""}`}
                                                    onClick={() => setCurTab(2)}
                                                >
                                                    {t('Delete Group')}
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