import { useState } from "react";
import './ReviewList.css'

import axios from "axios";
function ReviewButtons({ gameId, userId, helpful, notHelpful }) {
    
    const [helpfulCount, setHelpfulCount] = useState(helpful)
    const [notHelpfulCount, setNotHelpfulCount] = useState(notHelpful)
    const [isClicked, setIsClicked] = useState(false)

    const handleClick = async (isHelpful) => {
        if (isClicked) return;

        const newHelpful = isHelpful ? helpfulCount + 1 : helpfulCount;
        const newNotHelpful = isHelpful ? notHelpfulCount : notHelpfulCount + 1;

        setHelpfulCount(newHelpful);
        setNotHelpfulCount(newNotHelpful);
        setIsClicked(true);

        try {
            await axios.patch(`http://localhost:8080/review/${gameId}/vote`, {
                authorId: userId,
                helpful: helpfulCount,
                notHelpful: notHelpfulCount
            });
        } catch (err) {
            console.error("Error Patching ", err);
        }
    }


    return (
        <>
            <div className="review-helpful-buttons">
                <div onClick={() => handleClick(true)}>
                    <p>Yes <span role="img" aria-label="thumbs up" style={{ color: 'green', fontSize: '1.5em' }}>👍</span> {helpfulCount}</p>
                </div>
                <div onClick={() => handleClick(false)}>
                    <p>No <span role="img" aria-label="thumbs down" style={{ color: 'red', fontSize: '1.5em' }}>👎</span> {notHelpfulCount}</p>
                </div>
            </div>
        </>
    )
}

export default ReviewButtons