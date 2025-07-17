// src/components/ReviewCard.jsx
export default function ReviewCard({ review }) {
  return (
    <div className="border rounded p-4 shadow-sm">
      <p className="font-medium">{review.username}</p>
      <p className="text-sm text-gray-500 mb-1">
        {review.isRecommended ? "👍 Recommended" : "👎 Not Recommended"} –{" "}
        {new Date(review.timeCreated).toLocaleDateString()}
      </p>
      <p className="whitespace-pre-wrap">{review.reviewContent}</p>
    </div>
  );
}
