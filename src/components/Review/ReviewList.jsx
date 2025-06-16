import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./ReviewList.css";
import ReviewButtons from "./ReviewButtons";
import ReviewUpdateForm from "./ReviewUpdateForm";

function ReviewList({ reloadSignal, onReload, game, userId }) {
  const [editingId, setEditingId] = useState(null);
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  const mediaUrl = "https://play-lh.googleusercontent.com/EicDCzuN6l-9g4sZ6uq0fkpB-1AcVzd6HeZ6urH3KIGgjw-wXrrtpUZapjPV2wgi5R4";

  useEffect(() => {
    axios
      .get(`http://localhost:8080/review/${game.gameId}/review-list`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [reloadSignal]);

  const { recommendPct, notRecommendPct } = useMemo(() => {
    const total = data.length;
    if (total === 0) return { recommendPct: 0, notRecommendPct: 0 };
    const rec = data.filter(r => r.recommended).length;
    const pct = Math.round((rec / total) * 100);
    return { recommendPct: pct, notRecommendPct: 100 - pct };
  }, [data]);

  const shownReviews = data.slice(0, visibleCount);

  return (
    <>
      <div className="d-flex align-items-center flex-column text-white pt-5 pb-3 review-summary-bar" >
        <div className="d-flex flex-row justify-content-between w-100">
          <div>Recommended {recommendPct}%</div>
          <div>Not recommended {notRecommendPct}%</div>
        </div>
        <div className="w-100">
          <progress className="w-100" value={recommendPct} max={100} style={{ flexGrow: 1 }} />
        </div>
      </div>
      <div className="reviews d-flex flex-column gap-2">
        {shownReviews.map((review) => (
          <div key={review.userId} className="review">

            {editingId === review.userId ? (
              <ReviewUpdateForm
                originalReview={review}
                onCancel={() => setEditingId(null)}
                onReload={onReload}
                gameId={game.gameId}
                userId={userId}
              />
            ) : (
              <div className="review-content d-flex flex-row gap-1">
                <div className="author-profile">
                  <img src={mediaUrl} ></img>
                  <strong>{review.userName}</strong>
                </div>
                <div className="content-detail d-flex flex-column align-items-start">
                  <div className="judge-section w-100 d-flex flex-row">
                    <div className="thumbs-icon"></div>
                    <div className="title">{review.recommended ? "Recommended" : "Not Recommended"}</div>
                  </div>
                  <div className="time-posted-section w-100">
                    Posted on {review.timeCreated}
                  </div>
                  <div className="content-section w-100">
                    {review.reviewContent}
                  </div>
                  <div className="actions-section w-100">
                    <span className="review-was-helpful">Was this review helpful?</span>
                    <div className={`${review.userId == userId ? "d-flex flex-row justify-content-between align-items-center" : ""}`}>
                      <ReviewButtons
                        gameId={game.gameId}
                        originalReview={review}
                        userId={userId}
                      />
                      {review.userId == userId && (
                        <div onClick={() => setEditingId(review.userId)} className="edit-btn"><u>Edit</u></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {visibleCount < data.length && (
        <p className="text-white" ><u onClick={() => setVisibleCount(v => v + 5)} style={{ cursor: "pointer" }}>Show more</u></p>
      )}
      {visibleCount >= data.length && data.length > 5 && (
        <p className="text-white" ><u onClick={() => setVisibleCount(5)} style={{ cursor: "pointer" }}>Show less</u></p>
      )}
    </>
  );
}

export default ReviewList;
