// src/components/ReviewCard.jsx
export default function ReviewCard({ review }) {
    return (
        <div className="border rounded p-4 shadow-sm">
            <a href={`http://localhost:5173/game/${review.gameId}`} className="text-2xl font-semibold mb-2" style={{ color: "white", fontSize: "24px" }}>{review.gameName}</a>
            <div className="author-info">
                <img src={review.authorAvatarUrl} alt="avatar" className="avatar" width={24} />
                <span className="author-name" style={{ color: "white" }}>{review.authorName}</span>
            </div>
            <p className="text-sm text-gray-500 mb-1" style={{ color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                    src={
                        review.recommended
                            ? "https://community.akamai.steamstatic.com/public/shared/images/userreviews/icon_thumbsUp.png?v=1"
                            : "https://community.akamai.steamstatic.com/public/shared/images/userreviews/icon_thumbsDown.png?v=1"
                    }
                    width="35"
                    alt={review.recommended ? "Thumbs Up" : "Thumbs Down"}
                />
                <span>
                    {review.recommended ? "Recommended" : "Not Recommended"} – {new Date(review.timeCreated).toLocaleDateString()}
                </span>
            </p>
            <p className="whitespace-pre-wrap" style={{ color: "white" }}>{review.reviewContent}</p>
        </div>
    );
}
