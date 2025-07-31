import { useContext } from 'react';
import './FamilyMemberTab.css'
import { AppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

export default function FamilyMemberTab({ members, isOwner, setCurTab }) {

    const { t } = useTranslation();
    const { onlineUsers: online } = useContext(AppContext);
    const onlineUsers = online;

    const isOnline = (username) => {
        return onlineUsers.includes(username);
    }


    return (
        <div className="main-tab">
            <div className="main-tab-header d-flex flex-row justify-content-between">
                <div className="status">
                    {t('Your Family members')}
                    <span className="members-count"> {members.length} </span>
                    /
                    <span className="members-limit"> 5 </span>
                </div>
                {
                    isOwner && (
                        <div className="btn-add-member" onClick={() => setCurTab(1)}>
                            <span>
                                <i className="icon"></i>
                                {t('Add Family members')}
                            </span>
                        </div>
                    )
                }
            </div>
            <div className="main-tab-body d-flex flex-row gap-2 flex-wrap">
                {members.length == 0 && <div>{t('You have no members')}</div>}
                {
                    members.map((m) => (
                        <div
                            key={m.id}
                            className={`member-item d-flex flex-row align-items-center ${isOnline(m.name) ? "online" : "offline"}`}
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

            </div>
        </div>
    );
}