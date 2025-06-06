import { useState, useEffect } from "react";
import axios from "axios";
function ReviewList({reloadSignal}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/review/1/reviews")
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching reviews:', error));
    }, [reloadSignal]);
    return (
        <>
            <h1>Reviews</h1>
            <ul>
                {data.map((review) => (
                    <div key={review.id} className="review">
                        <div className="review-header">
                            <p>{review.authorName}</p>
                            <p>Posted on {review.timeCreated}</p>
                        </div>
                        <div className="review-rating">
                            <i></i>
                            <p>{review.isRecommend ? 'Recommended' : 'Not Recommended'}</p>
                        </div>
                        <p>{review.content}</p>
                        <div className="review-helpful">
                            <p>Was this review helpful</p>
                        </div>
                        <div className="review-helpful-buttons">
                            <div>
                                <p>Yes {review.helpful}</p>
                            </div>
                            <div>
                                <p>No {review.notHelpful}</p>
                            </div>
                        </div>
                    </div>

                ))}
            </ul>
        </>
    );
}

export default ReviewList;