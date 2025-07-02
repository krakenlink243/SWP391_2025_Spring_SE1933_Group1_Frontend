import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './ReviewForm.css';
import Button from '../Button/Button';
function ReviewForm({ onReload, game }) {
    const [reviewContent, setReviewContent] = useState('');
    const [recommended, setRecommended] = useState(null);
    const CUR_USER_AVATAR = localStorage.getItem("avatarUrl");
    const UNKNOW_AVATAR_URL = localStorage.getItem("unknowAvatar");


    const handleSubmit = async () => {
        if (recommended === null || reviewContent.trim() === '') {
            alert('Please fill in all fields before submitting.');
            return false;
        }
        try {
            console.log('recommended:', recommended);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/review/post`, {
                recommended: recommended,
                reviewContent: reviewContent,
                gameId: game.gameId,
            });
            setReviewContent('');
            return true;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data;

                if (status === 422) {
                    alert(message || 'Your review contains inappropriate content.');
                } else {
                    alert('An error occurred: ' + (message || 'Unknown error.'));
                }
            } else {
                alert('Network error. Please try again later.');
            }
            return false;
        }
    };

    return (
        <>
            <div className='review-post-container'>
                <div className='review-post-header'>
                    <h2>Write a review for {game.name}</h2>
                </div>
                <div className='review-post-body d-flex'>
                    <div className='review-post-body-avatar'>
                        <img src={CUR_USER_AVATAR ? CUR_USER_AVATAR : UNKNOW_AVATAR_URL} />
                    </div>
                    <div className='review-post-body-actions w-100'>
                        <div className='actions-input-box'>
                            <textarea
                                placeholder="Write your review here..."
                                value={reviewContent}
                                maxLength={8000}
                                onChange={(e) => setReviewContent(e.target.value)}
                            ></textarea>
                            <div className="text-end small text-muted">
                                {reviewContent.length} / 8000
                            </div>
                        </div>
                        <div className='actions-buttons  d-flex justify-content-between align-items-center w-100'>
                            <div className="recommend-buttons">
                                <div className='pb-1'>Do you recommend this game?</div>
                                <div onClick={() => {
                                    setRecommended(true);
                                }} className={`btn button ${recommended === true ? 'selected' : ''}`}>
                                    👍 Yes
                                </div>
                                <div onClick={() => setRecommended(false)} className={`btn button ${recommended === false ? 'selected' : ''}`}>
                                    👎 No
                                </div>
                            </div>
                            <div className='publish-button'>
                                <Button label="Post Review" color="blue-button" onClick={async () => {
                                    const result = await handleSubmit();
                                    if (result) onReload();
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReviewForm;