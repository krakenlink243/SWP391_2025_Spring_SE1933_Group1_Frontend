import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Hook để lấy params từ URL
import "./GameDetail.css"; // Tạo file CSS này sau
import Review from "../Review/Review"; // Import component Review

const GameDetail = () => {
  const { gameId } = useParams();
  console.log("Gameid", gameId);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const handleThumbnailClick = (mediaItem) => {
    setActiveMedia(mediaItem);
  };
  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8080/game/${gameId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGame(data);
        if (data && data.media && data.media.length > 0) {
          setActiveMedia(data.media[0]);
        }
      } catch (e) {
        console.error("Failed to fetch game details:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);

  if (loading) {
    return <div className="loading-message">Loading game details...</div>;
  }

  if (error) {
    return (
      <div className="error-message">Error fetching game details: {error}</div>
    );
  }

  if (!game) {
    return <div className="not-found-message">Game not found.</div>;
  }

  return (
    <div className="game-detail-page">
      <h1 className="game-title">{game.name}</h1>

      <div className="detail-main-content">
        <div className="media-column">
          <div className="main-media-banner">
            {activeMedia.type === "image" ? (
              <img src={activeMedia.url} alt="Game banner" />
            ) : (
              <video src={activeMedia.url} controls autoPlay muted />
            )}
          </div>
          <div className="media-thumbnail-strip">
            {game.media.map((mediaItem) => (
              <img
                key={mediaItem.mediaId}
                src={mediaItem.url}
                alt="Game thumbnail"
                className={`thumbnail ${
                  activeMedia.mediaId === mediaItem.mediaId ? "active" : ""
                }`}
                onClick={() => handleThumbnailClick(mediaItem)}
              />
            ))}
          </div>
        </div>

        <div className="info-column">
          <img
            src={game.media[0].url}
            alt="Game cover"
            className="info-cover-image"
          />
          <p className="short-description">{game.shortDescription}</p>
          <div className="info-grid">
            <span>
              <strong>Nhà phát hành:</strong>
            </span>
            <span>{game.publisher.publisherName}</span>
            <span>
              <strong>Ngày phát hành:</strong>
            </span>
            <span>{game.releaseDate}</span>
          </div>
          <div className="tag-list">
            {game.tags.map((tag) => (
              <span key={tag.tagId} className="tag">
                {tag.tagName}
              </span>
            ))}
          </div>
          <div className="purchase-box">
            <span className="price">${game.price.toFixed(2)}</span>
            <button className="add-to-cart-button">Add to Cart</button>
          </div>
        </div>
      </div>

      {/* === PHẦN DƯỚI: MÔ TẢ ĐẦY ĐỦ VÀ YÊU CẦU HỆ THỐNG === */}
      <div className="bottom-section">
        <div className="full-description-section">
          <h2>Mô tả chi tiết</h2>
          <p>{game.fullDescription}</p>
        </div>
        <div className="system-requirements-section">
          <h2>Yêu cầu hệ thống</h2>
          <div className="requirements-grid">
            <span>
              <strong>Hệ điều hành:</strong>
            </span>
            <span>{game.os}</span>
            <span>
              <strong>Bộ xử lý:</strong>
            </span>
            <span>{game.processor}</span>
            <span>
              <strong>Bộ nhớ:</strong>
            </span>
            <span>{game.memory}</span>
            <span>
              <strong>Đồ họa:</strong>
            </span>
            <span>{game.graphics}</span>
            <span>
              <strong>Lưu trữ:</strong>
            </span>
            <span>{game.storage}</span>
            <span>
              <strong>Ghi chú thêm:</strong>
            </span>
            <span>{game.additionalNotes}</span>
          </div>
          <div>
            <Review gameId={gameId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
