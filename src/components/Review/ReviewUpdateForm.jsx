import { useState } from 'react';
import axios from 'axios';
import './ReviewList.css'; // Assuming you have a CSS file for styling

function ReviewUpdateForm({ originalReview, onReload, onCancel, gameId, userId }) {
    const [updateReviewContent, setUpdateReviewContent] = useState(originalReview.reviewContent);
    const [updateRecommended, setUpdateRecommended] = useState(originalReview.recommended);

    const handleUpdate = async () => {
        await axios.put(`/api/review/${originalReview.id}`, {
            content: updateReviewContent,
            recommended: updateRecommended,
        });
        onReload();
        onCancel();
    };

    const handleDelete = async () => {
        await axios.delete(`/api/review/${originalReview.id}`);
        onReload();
        onCancel();
    };

    return (
        <div className="review-form">
            <button onClick={handleDelete}>Delete</button>
            <textarea
                value={updateReviewContent}
                onChange={(e) => setUpdateReviewContent(e.target.value)}
            />
            <p>Do you recommend this game?</p>
            <div className="recommend-options">
                <div onClick={() => setUpdateRecommended(true)} className={updateRecommended ? 'selected' : ''}>👍 Yes</div>
                <div onClick={() => setUpdateRecommended(false)} className={!updateRecommended ? 'selected' : ''}>👎 No</div>
            </div>
            <button onClick={onCancel}>Cancel</button>
            <button
                onClick={handleUpdate}
                disabled={
                    updateReviewContent === originalReview.reviewContent &&
                    updateRecommended === originalReview.recommended
                }
            >
                Update Review
            </button>
        </div>
    );
}


export default ReviewUpdateForm;