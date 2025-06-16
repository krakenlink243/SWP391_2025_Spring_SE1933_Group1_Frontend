import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./ReviewList.css";
import ReviewButtons from "./ReviewButtons";
import ReviewUpdateForm from "./ReviewUpdateForm";

function ReviewList({ reloadSignal, onReload, game, userId }) {
  const [editingId, setEditingId] = useState(null);
  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

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
      <div className="review-summary-bar" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>👍 {recommendPct}%</span>
        <progress value={recommendPct} max={100} style={{ flexGrow: 1 }} />
        <span>👎 {notRecommendPct}%</span>
      </div>
      <div className="reviews">
        {data.map((review) => (
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
              <>
                <div className="review-header">
                  <p>{review.userName}</p>
                  <p>Posted on {review.timeCreated}</p>
                </div>
                <div className="review-rating">
                  <i></i>
                  <p>{review.recommended ? "Recommended" : "Not Recommended"}</p>
                </div>
                <p>{review.reviewContent}</p>
                <div className="review-helpful">
                  <p>Was this review helpful</p>
                </div>
                <div className="review-footer">
                  <ReviewButtons
                    gameId={game.gameId}
                    originalReview={review}
                    userId={userId}
                  />
                  {review.userId == userId && (
                    <div onClick={() => setEditingId(review.userId)} style={{ cursor: "pointer" }}><u>Edit</u></div>
                  )}

                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {visibleCount < data.length && (
        <button onClick={() => setVisibleCount(v => v + 5)}>
          Load more ({data.length - visibleCount} left)
        </button>
      )}
      {visibleCount >= data.length && data.length > 5 && (
        <button onClick={() => setVisibleCount(5)}>
          Show less
        </button>
      )}
    </>
  );
}

export default ReviewList;
