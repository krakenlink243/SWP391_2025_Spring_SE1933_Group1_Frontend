// ThreadView.jsx
import { Link } from "react-router-dom";

export default function ThreadView({ thread, onEditClick, CUR_USERID }) {
  return (
    <div className="post-container">
      <div className="post-header">
        <h2 className="post-title">{thread.title}</h2>
        <div className="user-info">
          <Link to={`/profile/${thread.userId}`}>{thread.username}</Link>
        </div>
      </div>
      <div className="post-content">
        {thread.content.split("\n").map((line, index) => (
          <p key={index} className="post-text">{line}</p>
        ))}
      </div>
      <div className="post-footer">
        <span>{new Date(thread.createdAt).toLocaleString()}</span>
        {String(CUR_USERID) === String(thread.userId) && (
          <div onClick={onEditClick} className="edit-button">
            <u>Edit</u>
          </div>
        )}
      </div>
    </div>
  );
}
