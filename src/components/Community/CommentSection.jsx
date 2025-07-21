// src/components/CommentSection.jsx
import { useState } from "react";
import axios from "axios";
import Button from "../../components/Button/Button";
import "./CommentSection.css";
import { Link } from "react-router";
export default function CommentSection({ threadId, comments, setComments }) {
  const [newComment, setNewComment] = useState("");

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
      alert("Failed to post comment.");
    }
  };

  return (
    <div>
      <br />
      <div className="space-y-3 mb-4">
        {comments.length === 0 ? (
          <p className="comment-empty">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.commentId} className="post-container">
              <div className="post-header">
                <div className="post-id">{c.commentId}</div>
                <div className="user-info">
                  <div>{c.username}</div>
                </div>
              </div>
              <div className="post-content">
                {c.content.split("\n").map((line, index) => (
                  <p key={index} class="post-text">{line}</p>
                ))}
              </div>
              <div className="post-footer">
                <span>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="new-comment-container">
        <textarea
          className="comment-textarea"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          label="Post Comment"
          onClick={handleSubmit}
          color="blue-button"
          disabled={!newComment.trim()}
        />
      </div>
    </div>
  );
}
