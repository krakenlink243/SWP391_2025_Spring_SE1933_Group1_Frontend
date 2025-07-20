// src/pages/ThreadDetailPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentSection from "../../components/Community/CommentSection";

export default function ThreadDetailPage() {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/discussions/${threadId}`)
      .then((res) => setThread(res.data))
      .catch((err) => console.error(err));

    axios.get(`${import.meta.env.VITE_API_URL}/api/discussions/${threadId}/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error(err));
  }, [threadId]);

  if (!thread) return <p className="p-4">Loading thread...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-1">{thread.title}</h2>
      <p className="text-sm text-gray-500 mb-4">
        by {thread.username} on {new Date(thread.createdAt).toLocaleString()}
      </p>
      <p className="mb-6 whitespace-pre-wrap">{thread.content}</p>

      <CommentSection threadId={threadId} comments={comments} setComments={setComments} />
    </div>
  );
}
