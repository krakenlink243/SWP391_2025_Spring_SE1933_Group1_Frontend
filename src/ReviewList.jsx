import { useState, useEffect } from "react";
import axios from "axios";
import './ReviewList.css';
import ReviewButtons from "./ReviewButtons";

function ReviewList({ reloadSignal }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/review/1/review-list")
            .then(response => {
                setData(response.data);
                console.log(response.data);
            })
            .catch(error => console.error('Error fetching reviews:', error));
    }, [reloadSignal]);
    return (
        <>
            <h1>Reviews</h1>
            <ul>
                {data.map((review) => (
                    <div key={review.id} className="review">
                        <div className="review-header">
                            <p>{review.userName}</p>
                            <p>Posted on {review.timeCreated}</p>
                        </div>
                        <div className="review-rating">
                            <i></i>
                            <p>{review.recommended ? 'Recommended' : 'Not Recommended'}</p>
                        </div>
                        <p>{review.reviewContent}</p>
                        <div className="review-helpful">
                            <p>Was this review helpful</p>
                        </div>
                        <ReviewButtons
                            gameId={1}
                            userId={review.userId}
                            helpful={review.helpful}
                            notHelpful={review.notHelpful} />
                    </div>

                ))}
            </ul>
        </>
    );
}

export default ReviewList;