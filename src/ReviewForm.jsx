import { useState } from 'react';
import axios from 'axios';
import './ReviewForm.css'; // Assuming you have a CSS file for styling
function ReviewForm({ onReload }) {
    const [reviewContent, setReviewContent] = useState('');
    const [recommended, setRecommended] = useState(null);

    const handleSubmit = async () => {
        if (recommended === null || reviewContent.trim() === '') {
            alert('Please fill in all fields before submitting.');
            return;
        }
        try {
            console.log('recommended:', recommended);
            // const newRecommended = recommended === null ? false : recommended; // Ensure it's a boolean
            const response = await axios.post('http://localhost:8080/review/1/post-review', {
                isRecommended: recommended,
                userId: 1,
                reviewContent: reviewContent,
            });
            console.log('Review submitted:', response.data);
            setReviewContent('');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    }
    return (
        <>
            <h1>Reviews</h1>
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
                            <div onClick={() => setRecommended(true)} className={recommended && recommended !== null ? 'selected' : ''}>
                                👍 Yes
                            </div>
                            <div onClick={() => setRecommended(false)} className={!recommended && recommended !== null ? 'selected' : ''}>
                                👎 No
                            </div>
                        </div>
                    </div>
                    <button onClick={async () => { await handleSubmit(); onReload(); }}>
                        Post Review
                    </button>
                </div>

            </div>
        </>
    )
}

export default ReviewForm;