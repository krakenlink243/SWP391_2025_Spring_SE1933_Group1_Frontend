import { useState } from 'react';
import axios from 'axios';
import './ReviewForm.css';
import Button from '../Button/Button';
function ReviewForm({ onReload, gameId, userId }) {
    const [reviewContent, setReviewContent] = useState('');
    const [recommended, setRecommended] = useState(null);

    const handleSubmit = async () => {
        if (recommended === null || reviewContent.trim() === '') {
            alert('Please fill in all fields before submitting.');
            return false;
        }
        try {
            console.log('recommended:', recommended);
            const response = await axios.post(`http://localhost:8080/review/${gameId}/post-review`, {
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
            <div className="review-form">
                <p>Make a Review for [Game Name]</p>
                <div className="review-form-inputs">
                    {/* <img src="avatar.png" alt="User Avatar" width={50} height={50} /> */}
                    <textarea
                        placeholder="Write your review here..."
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                    ></textarea>
                </div>
                <p>Do you recommend this game?</p>
                <div className='review-form-buttons'>
                    <div>
                        <div className="recommend-options">
                            <div onClick={() => {
                                setRecommended(true);
                            }} className={recommended === true ? 'selected' : ''}>
                                👍 Yes
                            </div>
                            <div onClick={() => setRecommended(false)} className={recommended === false ? 'selected' : ''}>
                                👎 No
                            </div>
                        </div>
                    </div>
                    {/* <button onClick={async () => {
                        const result = await handleSubmit();
                        if (result) onReload();
                    }}>
                        Post Review
                    </button> */}
                    <Button label="Post Review" color="blue-button" onClick={async () => {
                        const result = await handleSubmit();
                        if (result) onReload();
                    }} />
                </div>

            </div>
        </>
    )
}

export default ReviewForm;