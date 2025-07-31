import { useContext, useEffect, useState } from 'react';
import './FamilyPage.css'
import { useNavigate } from 'react-router-dom';
import FamilyMemberTab from './FamilyMemberTab';
import FamilyLibraryTab from './FamilyLibraryTab';
import FamilyInvitationTab from './FamilyInvitationTab';
import FamilySettingTab from './FamilySettingTab';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import Button from '../../components/Button/Button';

export default function FamilyPage() {

    const { token } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { walletBalance } = useContext(AppContext);

    const username = localStorage.getItem("username");
    const avatarUrl = localStorage.getItem("avatarUrl");
    const [curTab, setCurTab] = useState(0);
    const [fadeClass, setFadeClass] = useState("fade-in");

    const [loading, setLoading] = useState(true);
    const [familyData, setFamilyData] = useState(null);
    const [isHaveFamily, setIsHaveFamily] = useState(false);
    const [plan, setPlan] = useState(null);
    const [invitations, setInvitations] = useState([]);


    const [isOwner, setIsOwner] = useState(false);


    useEffect(() => {
        if (!token) {
            navigate("/");
        }

        axios.get(`${import.meta.env.VITE_API_URL}/api/family`)
            .then((response) => {
                const data = response.data.data;
                setFamilyData(data);
                setIsHaveFamily(data && data.familyId && data.familyId !== -1);
                setIsOwner(data && data.isOwner);
                setPlan(data.subscriptionPlan)
                console.log("Family data fetched successfully:", data);
            })
            .catch((error) => {
                console.error("Error fetching family data:", error);
                setIsHaveFamily(false);
            })
            .finally(() => {
                setLoading(false);
            });

        handleGetInvitations();

    }, [token, navigate, curTab]);

    const handleGetInvitations = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/family/invitation`)
            .then((response) => {
                setInvitations(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching invitations:", error);
            });
    }
    const tabs = familyData ? [
        <FamilyMemberTab members={familyData.members} isOwner={isOwner} />,
        <FamilyLibraryTab familyData={familyData} />,
        <FamilyInvitationTab />,
        <FamilySettingTab
            members={familyData.members}
            isOwner={familyData.isOwner}
            handleDeleteFamily={() => handleDeleteFamily()}
            setFamilyData={setFamilyData}
            setPlan={setPlan}
            curPlan={plan}
        />
    ] : [];


    const handleChangeTab = (indx) => {
        setFadeClass("fade-out");

        setTimeout(() => {
            setCurTab(indx);
            setFadeClass("fade-in");
        }, 300);
    };

    const handleSubscription = async (plan) => {
        if (walletBalance < plan.price) {
            const params = {
                amount: plan.price,
                language: "en",
            };
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/payments/create-vnpay-payment`,
                null,
                { params: params }
            );
            const { paymentUrl } = response.data;
            if (paymentUrl) {
                window.location.href = paymentUrl;
            }
            return;
        }
        axios.post(`${import.meta.env.VITE_API_URL}/api/family/subscribe`, {
            planName: plan.name,
            price: plan.price,
            duration: plan.duration
        }).then((response) => {
            console.log("Subscription successful:", response.data);
            // Optionally, you can refresh the family data or redirect the user
            setIsHaveFamily(true);
            setFamilyData(response.data.data);
            setPlan(response.data.data.subscriptionPlan);
            setIsOwner(true);
            alert(t('Subscription successful!'));
        }).catch((error) => {
            console.error("Error subscribing to plan:", error);
            // Handle error, show notification, etc.
        })
    }

    const handleAcceptInvitation = (inviteId) => {
        axios.post(`${import.meta.env.VITE_API_URL}/api/family/invitation/accept/${inviteId}`)
            .then((response) => {
                const data = response.data.data;
                setFamilyData(data);
                setIsHaveFamily(true);
                setIsOwner(data.isOwner);
                setPlan(data.subscriptionPlan);
                setInvitations(invitations.filter(invite => invite.inviteId !== inviteId));
                alert(t('Invitation accepted successfully!'));
            })
            .catch((error) => {
                console.error("Error accepting invitation:", error);
                alert(t('Failed to accept invitation.'));
            });
    }

    const handleDeleteFamily = () => {
        if (!isOwner) {
            alert(t('You do not have privileges to delete the family.'));
            return;
        }
        if (window.confirm(t('Are you sure you want to delete your family? This action cannot be undone.'))) {
            axios.delete(`${import.meta.env.VITE_API_URL}/api/family/delete`)
                .then((response) => {
                    console.log("Family deleted successfully:", response.data);
                    setFamilyData(null);
                    setIsHaveFamily(false);
                    setIsOwner(false);
                    setPlan(null);
                    alert(t('Family deleted successfully!'));
                }
                ).catch((error) => {
                    console.error("Error deleting family:", error);
                    alert(t('Failed to delete family.'));
                }
                );
        }
    }


    return (
        loading ? (
            <div className='loading-container d-flex flex-column align-items-center justify-content-center'>
                <div className='loading-spinner'></div>
            </div>
        ) : (
            isHaveFamily && familyData ? (
                <div className="family-page-container" >
                    <div className="family-page-header d-flex flex-row align-items-center">
                        <img src={avatarUrl} alt="avatar" className="avatar" onClick={() => navigate("/profile")} />
                        <div className='d-flex flex-column justify-content-start align-items-start'>
                            <Link to="/profile" className='username'>{username}</Link>
                            <div>Current plan: {plan ? plan.planName : "None"}</div>
                            {
                                plan && (
                                    <div>Plan end at: {familyData.expDate}</div>
                                )
                            }
                        </div>
                    </div>
                    <div className="family-page-content d-flex flex-row">
                        <div className="content-left-nav d-flex flex-column w-25">
                            <h4 className="nav-title">{t('Friends')}</h4>
                            <div
                                className={`nav-item${curTab === 0 ? " active" : ""}`}
                                onClick={() => handleChangeTab(0)}
                            >
                                {t('Family Members')}
                            </div>
                            <div
                                className={`nav-item${curTab === 1 ? " active" : ""}`}
                                onClick={() => handleChangeTab(1)}
                            >
                                {t('Family Libary')}
                            </div>
                            {
                                isOwner && (
                                    <div
                                        className={`nav-item${curTab === 2 ? " active" : ""}`}
                                        onClick={() => handleChangeTab(2)}
                                    >
                                        {t('Pending Invitations')}
                                    </div>
                                )
                            }
                            <div
                                className={`nav-item${curTab === 3 ? " active" : ""}`}
                                onClick={() => handleChangeTab(3)}
                            >
                                {t('Settings')}
                            </div>
                        </div>
                        <div className={`content-right-detail w-75 ${fadeClass}`}>
                            {tabs[curTab]}
                        </div>
                    </div>
                </div>
            ) : (
                <div className='subscription-container d-flex flex-column align-items-center justify-content-center'>
                    <h2 className="mb-4">{t('You do not have a family yet.')}</h2>
                    <p className="mb-4">{t('Choose a plan below to create your family group')}</p>

                    <div className="plan-cards d-flex gap-4">
                        <div className="plan-card border rounded p-4 text-center shadow-sm"
                            onClick={() => handleSubscription({ name: 'Bronze', price: 3, duration: 30 })}
                        >
                            <h4>{t('Bronze')}</h4>
                            <p>30 {t('days')}</p>
                            <p className="fw-bold" style={{ color: '#cd7f32' }}>{(3).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                            <button className="btn btn-outline-bronze mt-2">
                                {t('Subscribe')}
                            </button>
                        </div>
                        <div className="plan-card border rounded p-4 text-center shadow-sm"
                            onClick={() => handleSubscription({ name: 'Silver', price: 5, duration: 30 })}
                        >
                            <h4>{t('Silver')}</h4>
                            <p>30 {t('days')}</p>
                            <p className="fw-bold text-secondary">{(5).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                            <button className="btn btn-outline-secondary mt-2">
                                {t('Subscribe')}
                            </button>
                        </div>
                        <div className="plan-card border rounded p-4 text-center shadow-sm"
                            onClick={() => handleSubscription({ name: 'Gold', price: 50, duration: 30 })}
                        >
                            <h4>{t('Gold')}</h4>
                            <p>30 {t('days')}</p>
                            <p className="fw-bold text-warning">{(50).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                            <button className="btn btn-outline-warning mt-2">
                                {t('Subscribe')}
                            </button>
                        </div>
                        <div className="plan-card border rounded p-4 text-center shadow-sm"
                            onClick={() => handleSubscription({ name: 'Platinum', price: 100, duration: 30 })}
                        >
                            <h4>{t('Platinum')}</h4>
                            <p>30 {t('days')}</p>
                            <p className="fw-bold" style={{ color: '#AF40FF' }}>{(100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                            <button className="btn btn-outline-platinum mt-2">
                                {t('Subscribe')}
                            </button>
                        </div>

                    </div>
                    {
                        invitations.length > 0 && (
                            <div className='w-100 py-5'>
                                <p>Or join to other Families via Invitations here:</p>
                                <div className='d-flex flex-column align-items-center justify-content-center'>
                                    {invitations.map((invitation) => (
                                        <div key={invitation.inviteId} className='invitation-card w-100 border rounded p-3 mb-3 w-50 text-center d-flex flex-row justify-content-between'>
                                            <h5>{invitation.senderName}'s Family</h5>
                                            <p>{t('Invited by')}: {invitation.senderName}</p>
                                            <Button label={'Accept'} color='gradient-green-button' onClick={() => handleAcceptInvitation(invitation.inviteId)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>
            )
        )

    );


}