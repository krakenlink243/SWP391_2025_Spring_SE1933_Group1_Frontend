import { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewList.css";
import ReviewButtons from "./ReviewButtons";
import ReviewUpdateForm from "./ReviewUpdateForm";

function ReviewList({ reloadSignal, onReload, gameId, userId }) {
  const [editingId, setEditingId] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/review/${gameId}/review-list`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [reloadSignal]);
  return (
    <>
      <ul>
        {data.map((review) => (
          <div key={review.userId} className="review">

            {editingId === review.userId ? (
              <ReviewUpdateForm
                originalReview={review}
                onCancel={() => setEditingId(null)}
                onReload={onReload}
                gameId={gameId}
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
                    gameId={gameId}
                    originalReview={review}
                    userId={userId}
                  />
                  {review.userId == userId && (
                    <div onClick={() => setEditingId(review.userId)} style={{cursor : "pointer"}}><u>Edit</u></div>
                  )}

                </div>
              </>
            )}
          </div>
        ))}
      </ul>
    </>
  );
}

export default ReviewList;
