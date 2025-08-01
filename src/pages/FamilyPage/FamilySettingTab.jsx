import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import './FamilySettingTab.css';
import Button from '../../components/Button/Button';
import axios from 'axios';

export default function FamilySettingTab({ members, isOwner, handleDeleteFamily, setFamilyData, curPlan, setPlan }) {

    const [curTab, setCurTab] = useState(0);
    const tabs = [
        <SubscribePlan setFamilyData={setFamilyData} setPlan={setPlan} curPlan={curPlan} />,
        <FamilyManagement members={members} handleDeleteFamily={handleDeleteFamily} />,
        <SubscriptionHistory />
    ];

    const handleLeaveFamily = () => {
        if (window.confirm("Are you sure you want to leave the family?")) {
            axios.post(`${import.meta.env.VITE_API_URL}/api/family/leave`)
                .then((response) => {
                    console.log("Left family successfully:", response.data);
                    setFamilyData(null);
                    setPlan(null);
                    alert("You have left the family successfully.");
                })
                .catch((error) => {
                    console.error("Error leaving family:", error);
                    alert("Failed to leave the family. Please try again.");
                });
        }
    };

    return (
        <div className="family-setting-tab d-flex flex-column align-items-center justify-content-center">
            {isOwner ? (
                <>
                    <div className="setting-nav d-flex flex-row justify-content-around w-100 align-items-center ">
                        <div
                            className={`nav-item ${curTab === 0 ? 'active' : ''}`}
                            onClick={() => setCurTab(0)}
                        >
                            Subscription Plans
                        </div>
                        <div
                            className={`nav-item ${curTab === 1 ? 'active' : ''}`}
                            onClick={() => setCurTab(1)}
                        >
                            Family Management
                        </div>
                        <div
                            className={`nav-item ${curTab === 2 ? 'active' : ''}`}
                            onClick={() => setCurTab(2)}
                        >
                            Subscription History
                        </div>
                    </div>
                    <div className="setting-content w-100">
                        {tabs[curTab]}
                    </div>
                </>
            ) : (
                <div className='w-100 p-5 text-white'>
                    <h3>Leave Family</h3>
                    <p>
                        You are currently a member of this family. If you leave, you will lose access to the family's subscription plan and features.
                    </p>
                    <p>
                        After leaving, you will be suspended from joining any family for <u>3 months</u>.
                    </p>
                    <p>
                        Are you sure you want to leave the family?
                    </p>
                    <Button label={'Leave Family'} color='red-button' onClick={handleLeaveFamily} />
                </div>
            )}
        </div>
    );
}

function SubscribePlan({ setFamilyData, setPlan, curPlan }) {
    const { t } = useTranslation();
    const { walletBalance } = useContext(AppContext);

    const handleSubscription = async (plan) => {
        if (curPlan) {
            if (curPlan && curPlan.planName === plan.name) {
                alert(t('You are already subscribed to this plan.'));
                return;
            }
            if (curPlan.price > plan.price) {
                alert(t('You cannot downgrade your plan. Please choose a plan with a higher price.'));
                return;
            }
        }
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
            alert(t('You have successfully subscribed to the plan.'));

            setFamilyData(response.data.data);
            setPlan(response.data.data.subscriptionPlan);
            alert(t('Subscription successful!'));
        }).catch((error) => {
            console.error("Error subscribing to plan:", error);
            // Handle error, show notification, etc.
        })
    }


    return (
        <div className='subscribe-plan-container d-flex flex-row flex-wrap align-items-center justify-content-center'>
            <div className='d-flex flex-row flex-wrap w-100 justify-content-around gap-2 py-3'>
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
            <div>
                Note: You can only subscribe to one plan at a time. If you subscribe to a new plan, it will replace your current subscription.
            </div>
        </div>
    );
}

function FamilyManagement({ members, handleDeleteFamily }) {
    const { t } = useTranslation();
    const [kickMembers, setKickMembers] = useState([]);
    const [isGroupEmpty, setIsGroupEmpty] = useState(false);

    const [familyMembers, setFamilyMembers] = useState(members.filter(member => member.isOwner === false));

    useEffect(() => {
        setFamilyMembers(members.filter(member => member.isOwner === false));
        setIsGroupEmpty(familyMembers.length === 0);
    }, [members]);

    const handleKickMember = () => {
        if (kickMembers.length === 0) {
            alert(t('No members selected to kick.'));
            return;
        }
        const memberIds = kickMembers.map(member => member.id);
        axios.post(`${import.meta.env.VITE_API_URL}/api/family/remove-member`, memberIds)
            .then((response) => {
                console.log("Members kicked successfully:", response.data);
                setFamilyMembers((prev) => prev.filter(member => !memberIds.includes(member.id)));
                setKickMembers([]);
                setIsGroupEmpty(familyMembers.length === 0);
            }
            ).catch((error) => {
                console.error("Error kicking members:", error);
                alert(t('Failed to kick members. Please try again.'));
            }
            );
    }

    return (
        <div className='member-management-container d-flex flex-column align-items-start justify-content-center'>
            <div className='section'>
                <h3>Kick Members</h3>
                <div className="form-group">
                    <label>Choosed Group Members</label>
                    <div className="selected-members-list d-flex flex-row flex-wrap align-items-center">
                        {kickMembers.map((member) => (
                            <div
                                key={member.id}
                                className="selected-member"
                                onClick={() =>
                                    setKickMembers((prev) =>
                                        prev.filter((m) => m.id !== member.id)
                                    )
                                }
                            >
                                <span className="selected-member-name">{member.name}</span>
                                ✕
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Choose Members</label>
                    <div className="member-list">
                        {familyMembers.map((member) => {
                            const isSelected = kickMembers.some((g) => g.id === member.id);
                            return (
                                <div
                                    key={member.id}
                                    className={`member-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (isSelected) {
                                            setKickMembers((prev) =>
                                                prev.filter((m) => m.id !== member.id)
                                            );
                                        } else {
                                            setKickMembers((prev) => [...prev, member]);
                                        }
                                    }}
                                >
                                    <div className="avatar">
                                        <img src={member.avatar}></img>
                                    </div>
                                    {member.name}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="d-flex w-100 flex-row justify-content-around align-items-center py-2">
                    <Button label={"Reset"} onClick={() => {
                        setKickMembers([]);
                    }}
                        color="grey-button"
                        disabled={kickMembers.length === 0}
                    />
                    <Button
                        label={`Kick ${kickMembers.length} Member${kickMembers.length > 1 ? 's' : ''}`}
                        onClick={() => handleKickMember()}
                        color="gradient-blue-button"
                        disabled={isGroupEmpty || kickMembers.length === 0}
                    />
                </div>
            </div>
            <div className='section'>
                <h3>Delete Family</h3>
                <p>By deleting this family, your current plan will also be remove and there is no refund.</p>
                <Button label={'Delete Family'} color='red-button' onClick={() => handleDeleteFamily()} />
            </div>
        </div>
    );
}

function SubscriptionHistory() {
    const { t } = useTranslation();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/family/subscription-history`)
            .then((response) => {
                console.log("Subscription history fetched successfully:", response.data);
                setHistory(response.data.data);
                setLoading(false);
            }
            ).catch((error) => {
                console.error("Error fetching subscription history:", error);
                alert(t('Failed to fetch subscription history. Please try again.'));
                setLoading(false);
            }
            );
    }, []);

    if (loading) {
        return <div className='loading'>{t('Loading...')}</div>;
    }

    // Helper function to get color style by plan name
    const getPlanColorStyle = (planName) => {
        switch (planName) {
            case 'Bronze':
                return { color: '#cd7f32', fontWeight: 'bold' };
            case 'Silver':
                return { color: '#6c757d', fontWeight: 'bold' };
            case 'Gold':
                return { color: '#ffc107', fontWeight: 'bold' };
            case 'Platinum':
                return { color: '#AF40FF', fontWeight: 'bold' };
            default:
                return {};
        }
    };

    return (
        <div className='subscription-history-container p-3'>
            <h3>{t('Subscription History')}</h3>
            {
                history.length > 0 ? (
                    <table className='subscription-history-table w-100'>
                        <thead>
                            <tr>
                                <th>{t('Plan Name')}</th>
                                <th>{t('Price')}</th>
                                <th>{t('Duration')}</th>
                                <th>{t('Date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={index}>
                                    <td style={getPlanColorStyle(item.planName)}>{item.planName}</td>
                                    <td>{item.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                                    <td>{item.duration} {t('days')}</td>
                                    <td>{new Date(item.startAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>{t('No subscription history available.')}</p>
                )
            }
        </div>
    );
}