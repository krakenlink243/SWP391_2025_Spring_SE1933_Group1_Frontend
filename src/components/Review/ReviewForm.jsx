import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './ReviewForm.css';
import Button from '../Button/Button';
function ReviewForm({ onReload, game, userId }) {
    const [reviewContent, setReviewContent] = useState('');
    const [recommended, setRecommended] = useState(null);

    const handleSubmit = async () => {
        if (recommended === null || reviewContent.trim() === '') {
            alert('Please fill in all fields before submitting.');
            return false;
        }
        try {
            console.log('recommended:', recommended);
            const response = await axios.post(`http://localhost:8080/review/${game.gameId}/post-review`, {
                recommended: recommended,
                userId: userId,
                reviewContent: reviewContent,
            });
            console.log('Review submitted:', response.data);
            setReviewContent('');
            return true;
        } catch (error) {
            console.error('Error submitting review:', error);
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
                        <img src='https://play-lh.googleusercontent.com/EicDCzuN6l-9g4sZ6uq0fkpB-1AcVzd6HeZ6urH3KIGgjw-wXrrtpUZapjPV2wgi5R4' />

                    </div>
                    <div className='review-post-body-actions w-100'>
                        <div className='actions-input-box'>
                            <textarea
                                placeholder="Write your review here..."
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                            ></textarea>
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