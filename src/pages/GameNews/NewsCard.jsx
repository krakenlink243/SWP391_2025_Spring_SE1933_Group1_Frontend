import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewsCard.css';

function NewsCard({ news, onClick, onDelete,mode }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/news/edit/${news.newsId}`);
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this news?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/game/news/delete/${news.newsId}`);
      console.log('News deleted successfully');
      onDelete?.(news.newsId);
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  return (
    <div
      className="news-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="timestamp-placeholder">
        {news.createdAt} {/* Replace with formatted news.createdAt */}
      </div>

      <img
        src={news.thumbnail}
        alt="news"
        className="news-image"
        onClick={onClick ? () => onClick(news.newsId) : undefined}
        style={{ cursor: onClick ? "pointer" : "default" }}
      />

      <div className="news-info">
        <h3
          className="news-title"
          onClick={onClick ? () => onClick(news.newsId) : undefined}
          style={{ cursor: onClick ? "pointer" : "default" }}
        >
          {news.title}
        </h3>
        <p
          className="news-description"
          onClick={onClick ? () => onClick(news.newsId) : undefined}
          style={{ cursor: onClick ? "pointer" : "default" }}
        >
          {news.summary}
        </p>
      </div>

      {hovered && mode !== "customer" && (
        <div className="news-actions">
          <button className="edit-btn" onClick={handleEditClick}>Edit</button>
          <button className="delete-btn" onClick={handleDeleteClick}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default NewsCard;
