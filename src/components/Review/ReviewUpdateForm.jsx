import { useState } from 'react';
import axios from 'axios';
import './ReviewUpdateForm.css';

function ReviewUpdateForm({ originalReview, onReload, onCancel, gameId, userId }) {
    const [updateReviewContent, setUpdateReviewContent] = useState(originalReview.reviewContent);
    const [updateRecommended, setUpdateRecommended] = useState(originalReview.recommended);

    const handleUpdate = async () => {
        if (!window.confirm('Are you sure you want to update this review?')) {
            return;
        }
        const resp = await axios.put(`http://localhost:8080/review/update/${gameId}`, {
            reviewContent: updateReviewContent,
            recommended: updateRecommended,
        });
        console.log('Update response:', resp.data);
        onReload();
        onCancel();
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return false;
        }
        const resp = await axios.delete(`http://localhost:8080/review/delete`, {
            gameId: gameId,
        });
        onReload();
        onCancel();
    };

    return (
        <div className='review-edit-container'>
            <div className='review-edit-header'>
                <div onClick={handleDelete} className='delete-button'>
                    <u>Delete</u>
                </div>
            </div>

            <div className='update-review-form-inputs'>
                <textarea
                    value={updateReviewContent}
                    onChange={(e) => setUpdateReviewContent(e.target.value)}
                />
            </div>
            <div className="recommend-buttons">
                <div className='pb-1'>Do you recommend this game?</div>
                <div onClick={() => setUpdateRecommended(true)} className={`btn button ${updateRecommended === true ? 'selected' : ''}`}>
                    👍 Yes
                </div>
                <div onClick={() => setUpdateRecommended(false)} className={`btn button ${updateRecommended === false ? 'selected' : ''}`}>
                    👎 No
                </div>
            </div>
            <div className='review-edit-footer'>
                <div onClick={onCancel} className='cancel-button'>
                    <p><u>Cancel</u></p>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={
                        updateReviewContent === originalReview.reviewContent &&
                        updateRecommended === originalReview.recommended
                    }
                    className='update-button'
                >
                    Update Review
                </button>
            </div>
        </div>
    );
}


export default ReviewUpdateForm;