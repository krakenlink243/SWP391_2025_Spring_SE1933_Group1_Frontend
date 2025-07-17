import { useEffect, useState } from "react";
import axios from "axios";
import ThreadCard from "../../components/Community/ThreadCard";
import ReviewCard from "../../components/Community/ReviewCard";
import CreateThreadModal from "../../components/Community/CreateThreadModal";

export default function Community() {
    const [threads, setThreads] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/discussions`)
            .then((res) => setThreads(res.data))
            .catch((err) => console.error(err));

        axios.get(`${import.meta.env.VITE_API_URL}/review/list-all`)
            .then((res) => {
                console.log("Review API response:", res.data);
                setReviews(res.data);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6" style={{ color: "white" }}>Community</h1>

            {/* Reviews Section */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-2" style={{ color: "white" }}>Game Reviews</h2>
                <div className="space-y-3">
                    {reviews.map((review, index) => (
                        <div key={index} className="review-card">
                            <div className="author-info">
                                <img src={review.authorAvatarUrl} alt="avatar" className="avatar" />
                                <span className="author-name" style={{ color: "white" }}>{review.authorName}</span>
                            </div>

                            <div className="review-content" style={{color: "white"}}>
                                <p><strong>Game:</strong> {review.gameName}</p>
                                <p>{review.reviewContent}</p>
                                <p><strong>Recommended:</strong> {review.recommended ? 'Yes' : 'No'}</p>
                                <p><small>{new Date(review.timeCreated).toLocaleDateString()}</small></p>
                            </div>
                        </div>
                    ))}

                </div>
            </section>

            {/* Threads Section */}
            <section>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold" style={{ color: "white" }}>Discussions</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Start New Thread
                    </button>
                </div>
                <div className="space-y-3">
                    {threads.map((thread) => (
                        <ThreadCard key={thread.threadId} thread={thread} />
                    ))}
                </div>
            </section>

            <CreateThreadModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}
