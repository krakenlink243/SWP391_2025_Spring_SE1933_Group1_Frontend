import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import './FamilyInvitationTab.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { createNotification } from '../../services/notification';

export default function FamilyInvitationTab() {


    const [loading, setLoading] = useState(true);
    const [invitations, setInvitations] = useState([]);

    useEffect(() => {
        // Fetch invitations from the server
        axios.get(`${import.meta.env.VITE_API_URL}/api/family/invitation/sent`)
            .then((response) => {
                const data = response.data.data;
                setInvitations(data);
            })
            .catch((error) => {
                console.error("Error fetching invitations:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const { t } = useTranslation();

    const handleCancel = (inviteId) => {
        axios.delete(`${import.meta.env.VITE_API_URL}/api/family/invitation/cancel/${inviteId}`)
            .then((response) => {
                if (response.data.success) {
                    setInvitations(invitations.filter(invite => invite.inviteId !== inviteId));
                }
            })
            .catch((error) => {
                console.error("Error cancelling invitation:", error);
                createNotification("error", t('Error'), t('Failed to cancel invitation'));
            });
    }

    return (
        <div className='family-invitation-tab'>
            <div className="box-title">
                <span className="title">{t('Sent Invites')}</span>
            </div>
            <div className="result">
                {
                    loading && (
                        <div className="tab-spinner">
                        </div>
                    )
                }
                {!loading && invitations.length == 0 && (
                    <div className="result-not-found">
                        {t('Sorry, there are no pending sent invites to show')}
                    </div>
                )}
                {!loading && invitations.map((invite) => (
                    <div className="box-item" key={invite.receiverId}>
                        <div className="friend-box">
                            <div className="avatar">
                                <img src={`${invite.receiverAvatar}`} alt={`${invite.receiverName}`} />
                            </div>
                            <div className="description">
                                {invite.receiverName}
                            </div>
                        </div>
                        <div className="friend-actions">
                            <div className="actions-btn" onClick={() => handleCancel(invite.inviteId)}>
                                <span>{t('Cancel')}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}