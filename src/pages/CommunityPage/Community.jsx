import { useEffect, useState } from "react";
import axios from "axios";
import ThreadCard from "../../components/Community/ThreadCard";
import ReviewCard from "../../components/Community/ReviewCard";
import Button from "../../components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './Community.css';
export default function Community() {
    const [threads, setThreads] = useState([]);
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();
    const {t} =useTranslation();
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
        <div className="community-page-container">
            <h1 className="text-3xl font-bold mb-6" style={{ color: "white" }}>{t('Community')}</h1>

            {/* Reviews Section */}
            <section className="review-section">
                <h2 className="review-section-title" style={{ color: "white" }}>{t('Game Reviews')}</h2>
                <div className="review-grid">
                    {reviews.map((review, index) => (
                        <ReviewCard key={index} review={review} />
                    ))}
                </div>
            </section>

            {/* Threads Section */}
            <section>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold" style={{ color: "white" }}>{t('Discussions')}</h2>

                    <Button
                        label={t("Start New Thread")}
                        onClick={() => navigate("/community/create-thread")}
                        color="blue-button"
                    />
                </div>
                <div className="thread-card">
                    <table className="table-container" role="table" aria-label="Forum topics table">
                        <thead>
                            <tr className="table-header-row">
                                <th className="table-header-cell">Topic</th>
                                <th className="table-header-cell">Author</th>
                                <th className="table-header-cell">Posted on</th>
                            </tr>
                        </thead>
                        <tbody>
                            {threads.map((thread) => (
                                <tr className="table-row" key={thread.threadId}>
                                    <td className="table-cell topic">
                                        <Link to={`/community/threads/${thread.threadId}`}>
                                            {thread.title}
                                        </Link>
                                    </td>
                                    <td className="table-cell">
                                        <Link to={`/profile/${thread.userId}`}>
                                            {thread.username}
                                        </Link>
                                    </td>
                                    <td className="table-cell">{new Date(thread.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
