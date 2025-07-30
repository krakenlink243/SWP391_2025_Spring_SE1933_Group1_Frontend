import { useContext } from 'react';
import './FamilyMemberTab.css'
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

export default function FamilyMemberTab({ setCurTab }) {

    const { t } = useTranslation();
    const { friendList, onlineUsers: online } = useContext(AppContext);
    const onlineUsers = online;

    const isOnline = (username) => {
        return onlineUsers.includes(username);
    }

    return (
        <div className="main-tab">
            <div className="main-tab-header d-flex flex-row justify-content-between">
                <div className="status">
                    {t('Your Family members')}
                    <span className="members-count"> {friendList.length} </span>
                    /
                    <span className="members-limit"> 285 </span>
                </div>
                <div className="btn-add-member" onClick={() => setCurTab(1)}>
                    <span>
                        <i className="icon"></i>
                        {t('Your Family members')}
                    </span>
                </div>
            </div>
            <div className="main-tab-body d-flex flex-row gap-2 flex-wrap">
                {friendList.length == 0 && <div>{t('You have no members')}</div>}
                {
                    friendList.map((friend, idx) => (
                        <div
                            key={friend.friendId}
                            className={`member-item d-flex flex-row align-items-center ${isOnline(friend.friendName) ? "online" : "offline"}`}
                            onClick={() => navigate(`/profile/${friend.friendId}`)}
                        >
                            <div className="member-avatar">
                                <img
                                    src={friend.friendAvatarUrl}
                                    alt={friend.friendName}
                                />
                            </div>
                            <div className={`spacer`}></div>
                            <div className="member-name">{friend.friendName}</div>
                        </div>
                    ))
                }

            </div>
        </div>
    );
}