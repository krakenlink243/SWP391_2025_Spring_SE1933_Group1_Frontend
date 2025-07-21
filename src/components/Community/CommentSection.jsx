// src/components/CommentSection.jsx
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function CommentSection({ threadId, comments, setComments }) {
  const [newComment, setNewComment] = useState("");
  const {t}=useTranslation();
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/discussions/${threadId}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert(t("Failed to post comment."));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{t('Comments')}</h3>
      <div className="space-y-3 mb-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">{t('No comments yet.')}</p>
        ) : (
          comments.map((c) => (
            <div key={c.commentId} className="border p-3 rounded shadow-sm">
              <p className="font-medium">{c.username}</p>
              <p className="text-sm text-gray-600">
                {new Date(c.createdAt).toLocaleString()}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{c.content}</p>
            </div>
          ))
        )}
      </div>

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows="3"
        placeholder={t("Write a comment...")}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t('Post Comment')}
      </button>
    </div>
  );
}
