import { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import './ReviewForm.css';
import Button from '../Button/Button';
import { useTranslation } from 'react-i18next';
function ReviewForm({ onReload, game }) {
    const [reviewContent, setReviewContent] = useState('');
    const [recommended, setRecommended] = useState(null);

    const CUR_USER_AVATAR = localStorage.getItem("avatarUrl");
    const isBanned = localStorage.getItem("banned") === "true";

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = async () => {

        if (isBanned) {
            alert(t("You are banned from posting reviews."));
            return false;
        }

        // Validate form
        if (recommended === null || reviewContent.trim().length < 10) {
            alert(t('Please fill in all fields before submitting. Minimum 10 characters.'));
            return false;
        }

        setIsSubmitting(true);

        try {
<<<<<<< Updated upstream
            await axios.post(`${import.meta.env.VITE_API_URL}/review/post`, {
=======
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/review/post`, {
>>>>>>> Stashed changes
                recommended: recommended,
                reviewContent: reviewContent,
                gameId: game.gameId,
            });
            setReviewContent('');
            setRecommended(null);

            return true;
        } catch (error) {

            if (error.response) {
                const status = error.response.status;
                const message = error.response.data.message;

                if (status === 422) {
                    alert(message || t('Your review contains inappropriate content.'));
                } else {
                    alert(t('An error occurred:') + (message || t('Unknown error.')));
                }
            } else {
                alert(t('Network error. Please try again later.'));
            }
            return false;
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className='review-post-container'>
                <div className='review-post-header'>
                    <h2>{t('Write a review for')} {game.name}</h2>
                </div>
                <div className='review-post-body d-flex'>
                    <div className='review-post-body-avatar'>
                        <img src={CUR_USER_AVATAR} />
                    </div>
                    <div className='review-post-body-actions w-100'>
                        <div className='actions-input-box'>
                            <div style={{ position: 'relative' }}>
                                <textarea
                                    placeholder={t("Write your review here...")}
                                    value={reviewContent}
                                    maxLength={8000}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                ></textarea>
                                {
                                    isBanned && (
                                        <div className='ban-message'>
                                            <div>
                                                You are currently being banned.
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="text-end small text-muted">
                                {reviewContent.length} / 8000
                            </div>
                        </div>
                        <div className='actions-buttons  d-flex justify-content-between align-items-center w-100'>
                            <div
                                className="recommend-buttons"
                                style={isBanned ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                            >
                                <div className='pb-1'>{t('Do you recommend this game?')}</div>
                                <div
                                    onClick={() => setRecommended(true)}
                                    className={`btn button ${recommended === true ? 'selected' : ''}`}
                                >
                                    👍 {t('Yes')}
                                </div>
                                <div
                                    onClick={() => setRecommended(false)}
                                    className={`btn button ${recommended === false ? 'selected' : ''}`}
                                >
                                    👎 {t('No')}
                                </div>
                            </div>
                            <div className='publish-button'>
                                <Button
                                    label={isSubmitting
                                        ? <span className="spinner"></span>
                                        : t("Post Review")}
                                    color="blue-button" onClick={async () => {
                                        const result = await handleSubmit();
                                        if (result) onReload();
                                    }}
                                    disabled={isBanned || reviewContent.trim().length < 10 || recommended === null}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReviewForm;