import { useState, useEffect, useRef } from "react";
import './ReviewListItem.css';
import ReviewButtons from "./ReviewButtons";

function ReviewListItem({ review, game, CUR_USERID, setEditingId }) {

  const contentSection = useRef(null);
  const [contentH, setContentH] = useState(0);
  const [revealAll, setRevealAll] = useState(false);


  useEffect(() => {
    if (contentSection) {
      setContentH(contentSection.current.offsetHeight);
    }
  }, [])

  return (
    <div className="review-content d-flex flex-row gap-1">
      <div className="author-profile">
        <img src={review.authorAvatarUrl} ></img>
        <strong>{review.authorName}</strong>
      </div>
      <div className="content-detail d-flex flex-column align-items-start">
        <div className="judge-section w-100 d-flex flex-row">
          <div className="thumbs-icon"></div>
          <div className="title">{review.recommended ? "Recommended" : "Not Recommended"}</div>
        </div>
        <div className="time-posted-section w-100">
          Posted on {review.timeCreated}
        </div>
        <pre className={`content-section w-100 mb-2 ${contentH > 225 && revealAll == false ? "partical" : "full"}`} ref={contentSection}>
          {review.reviewContent}
          {contentH > 225 && revealAll == false && (
            <div className={`gradient w-100`}></div>
          )}
        </pre>
        {contentH > 225 && revealAll == false && (
          <div className="posted w-100">
            <div className="view-more-btn" onClick={() => setRevealAll(true)}>
              Read more
            </div>
          </div>
        )}

        <div className="hr w-100"></div>
        <div className="actions-section w-100">
          <span className="review-was-helpful">Was this review helpful?</span>
          <div className={`${review.authorId == CUR_USERID ? "d-flex flex-row justify-content-between align-items-center" : ""}`}>
            <ReviewButtons
              game={game}
              authorId={review.authorId}
              reivewHelpful={review.helpful}
              reivewNotHelpful={review.notHelpful}
            />
            {review.authorId == CUR_USERID && (
              <div onClick={() => setEditingId(review.authorId)} className="edit-btn"><u>Edit</u></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewListItem;
