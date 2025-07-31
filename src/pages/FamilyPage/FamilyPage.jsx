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

export default function FamilyPage() {

    const { token } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const username = localStorage.getItem("username");
    const avatarUrl = localStorage.getItem("avatarUrl");
    const [curTab, setCurTab] = useState(0);
    const [fadeClass, setFadeClass] = useState("fade-in");

    const [loading, setLoading] = useState(true);
    const [familyData, setFamilyData] = useState(null);
    const [isHaveFamily, setIsHaveFamily] = useState(false);

    
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
            })
            .catch((error) => {
                console.error("Error fetching family data:", error);
                setIsHaveFamily(false);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [token, navigate, curTab]);

    const tabs = familyData ? [
        <FamilyMemberTab members={familyData.members} isOwner={isOwner} />,
        <FamilyLibraryTab familyData={familyData} />,
        <FamilyInvitationTab />,
        <FamilySettingTab />
    ] : [];


    const handleChangeTab = (indx) => {
        setFadeClass("fade-out");

        setTimeout(() => {
            setCurTab(indx);
            setFadeClass("fade-in");
        }, 300);
    };

    const handleSubscription = (plan) => {
        axios.post(`${import.meta.env.VITE_API_URL}/api/family/subscribe`, {
            planName: plan.name,
            price: plan.price,
            duration: plan.duration
        }).then((response) => {
            console.log("Subscription successful:", response.data);
            // Optionally, you can refresh the family data or redirect the user
            setIsHaveFamily(true);
            setFamilyData(response.data.data);
        }).catch((error) => {
            console.error("Error subscribing to plan:", error);
            // Handle error, show notification, etc.
        })
    }

    return (
        loading ? (
            <div className='loading-container d-flex flex-column align-items-center justify-content-center'>
                <div className='loading-spinner'></div>
            </div>
        ) : (
            isHaveFamily ? (
                <div className="family-page-container" >
                    <div className="family-page-header d-flex flex-row align-items-center">
                        <img src={avatarUrl} alt="avatar" className="avatar" onClick={() => navigate("/profile")} />
                        <Link to="/profile" className='username'>{username}</Link>
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
                            <p className="fw-bold" style={{ color: '#cd7f32' }}>3$</p>
                            <button className="btn btn-outline-bronze mt-2">
                                {t('Subscribe')}
                            </button>
                        </div>
                        <div className="plan-card border rounded p-4 text-center shadow-sm"
                            onClick={() => handleSubscription({ name: 'Silver', price: 129000, duration: 30 })}
                        >
                            <h4>{t('Silver')}</h4>
                            <p>30 {t('days')}</p>
                            <p className="fw-bold text-secondary">129,000 VND</p>
                            <button className="btn btn-outline-secondary mt-2">
                                {t('Subscribe')}
                            </button>
                        </div>
                        <div className="plan-card border rounded p-4 text-center shadow-sm"
                            onClick={() => handleSubscription({ name: 'Gold', price: 199000, duration: 30 })}
                        >
                            <h4>{t('Gold')}</h4>
                            <p>30 {t('days')}</p>
                            <p className="fw-bold text-warning">199,000 VND</p>
                            <button className="btn btn-outline-warning mt-2">
                                {t('Subscribe')}
                            </button>
                        </div>
                        <div className="plan-card border rounded p-4 text-center shadow-sm"
                            onClick={() => handleSubscription({ name: 'Platinum', price: 199000, duration: 30 })}
                        >
                            <h4>{t('Platinum')}</h4>
                            <p>30 {t('days')}</p>
                            <p className="fw-bold" style={{ color: '#AF40FF' }}>199,000 VND</p>
                            <button className="btn btn-outline-platinum mt-2">
                                {t('Subscribe')}
                            </button>
                        </div>

                    </div>
                </div>
            )
        )

    );


}