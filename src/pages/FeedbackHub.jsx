import React from 'react'
import { useEffect, useState } from 'react'
import './FeedbackHub.css'
import axios from 'axios'
import Button from '../components/Button/Button'
import FeedbackItem from '../components/FeedbackItem/FeedbackItem'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

function FeedbackHub() {
    const [feedbackItems, setFeedbackItems] = useState([])
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { token } = useAuth();

    const fetchData = async () => {
        try {
            const response = await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/feedback/user/${page}`);
            setFeedbackItems(response.data.content);
            console.log(response.data.content)
            setTotalPages(response.data.totalPages);
            console.log(response.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };
    useEffect(() => {
        fetchData();
    }, [page])
    const handlePageClick = (pageNumber) => {
        setPage(pageNumber);
    };
    const handleViewClick = (feedbackId) => {
        navigate(`/feedbackhub/${feedbackId}`);
    };
    const handleDeleteClick = async (feedbackId) => {
        if (window.confirm(t("Are you sure you want to delete this feedback?"))) {
            try {
                await axios.delete(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/feedback/user/${feedbackId}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting feedback:', error);
            }
        }
    };

    const handleCreateFeedback = () => {
        if (!token) {
            navigate('/login');
            return;
        }
        navigate('/sendfeedback');
    }
    return (
        <div className='feedback-hub-container'>
            <div className='feedback-hub-title'>
                <h1>{t('Feedback Hub')}</h1>
            </div>
            <div className='create-feedback-button'>
                <Button label={t('Write New Feedback')} color='blue-button' onClick={() => handleCreateFeedback()} />
            </div>
            <div className='your-feedback'>
                {
                    token && (
                        <div>
                            <h2>{t('Your Submitted Feedback')}</h2>
                            {feedbackItems.length === 0 ? (
                                <p>{t('No feedback available.')}</p>
                            ) : (
                                <div className='your-feedback-item'>
                                    {feedbackItems.map((feedback) => (
                                        <FeedbackItem
                                            key={feedback.requestId}
                                            title={feedback.subject}
                                            status={feedback.status === 0 ? t('Pending') : feedback.status === 1 ? t('Answered') : t('Dismissed')}
                                            action1={'View'}
                                            action2={'Delete'}
                                            time={feedback.createdDate}
                                            onAction1Click={() => handleViewClick(feedback.requestId)}
                                            onAction2Click={() => handleDeleteClick(feedback.requestId)}
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="pagination-controls">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageClick(index)}
                                        className={page === index ? "active" : ""}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default FeedbackHub
