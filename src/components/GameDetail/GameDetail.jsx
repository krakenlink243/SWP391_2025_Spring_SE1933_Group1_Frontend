import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Thêm Link cho breadcrumb
import "./GameDetail.css";
import Review from "../Review/Review";
import axios from "axios";

// Added by Phan NT Son
import { createNotification } from "../../services/notification";
// add by Bathanh
  const userId = localStorage.getItem("userId");

  
const GameDetail = () => {
  const { gameId } = useParams();
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
        const response = await axios.get(
          `http://localhost:8080/game/${gameId}`
        ); // Giả sử API endpoint của bạn là đây
        const data = response.data;
        setGame(data);

        if (data && data.media && data.media.length > 0) {
          // Ưu tiên video hoặc ảnh header làm media chính
          const headerMedia =
            data.media.find(
              (m) => m.type.includes("video") || m.type.includes("header")
            ) || data.media[0];
          setActiveMedia(headerMedia);
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

  if (loading)
    return <div className="loading-message">Loading game details...</div>;
  if (error)
    return (
      <div className="error-message">Error fetching game details: {error}</div>
    );
  if (!game) return <div className="not-found-message">Game not found.</div>;

  const addCartHandler = async () => {
    try {
      const response = await axios.post(
        //adjust add by Bathanh
        `http://localhost:8080/users/${userId}/cart/add?gameId=${gameId}`
      );
      console.log("Add to cart response:", response.data);

      // @author Phan NT Son
      // Tạo thông báo khi người dùng thêm game vào giỏ hàng
      if (response.data.success) {
        createNotification(`Game ${game.name} has been added to your cart.`);
        alert("Game added to cart successfully!");
      } else {
        alert("Game already bought or not available.");
      }

    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add game to cart.");
    }
  };

  // Lấy ảnh bìa (capsule) cho cột thông tin bên phải
  const coverImageUrl =
    game.media?.find((m) => m.type.toLowerCase().includes("header"))?.url ||
    game.media?.[0]?.url ||
    "";

  return (
    <div className="game-detail-page">
      <div className="breadcrumb">
        <Link to="/">All Games</Link> &gt; <span>{game.name}</span>
      </div>
      <h1 className="game-title-header">{game.name}</h1>

      <div className="detail-main-content">
        {/* === CỘT TRÁI - MEDIA === */}
        <div className="media-column">
          {activeMedia && (
            <div className="main-media-banner">
              {activeMedia.type.toLowerCase().includes("video") ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  muted
                  loop
                  key={activeMedia.mediaId}
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt="Game banner"
                  key={activeMedia.mediaId}
                />
              )}
            </div>
          )}
          <div className="media-thumbnail-strip">
            {game.media.map((mediaItem) => (
              <div
                key={mediaItem.mediaId}
                className={`thumbnail-container ${
                  activeMedia?.mediaId === mediaItem.mediaId ? "active" : ""
                }`}
                onClick={() => handleThumbnailClick(mediaItem)}
              >
                <img
                  src={mediaItem.url}
                  alt="Game thumbnail"
                  className="thumbnail"
                />
              </div>
            ))}
          </div>
        </div>

        {/* === CỘT PHẢI - THÔNG TIN & MUA HÀNG === */}
        <div className="info-column">
          <img
            src={coverImageUrl}
            alt="Game cover"
            className="info-cover-image"
          />
          <p className="short-description">{game.shortDescription}</p>

          <div className="info-grid">
            <div className="info-row">
              <strong className="info-label">RELEASE DATE:</strong>
              <span className="info-value">
                {new Date(game.releaseDate).toLocaleDateString()}
              </span>
            </div>
            <div className="info-row">
              <strong className="info-label">PUBLISHER:</strong>
              <span className="info-value">
                {game.publisher?.publisherName || "N/A"}
              </span>
            </div>
          </div>

          <div className="tag-list-detail">
            {game.tags.map((tag) => (
              // Mỗi tag giờ là một Link trỏ đến trang game với query parameter
              <Link
                to={`/game?tags=${tag.tagId}`} // URL sẽ có dạng /games?tags=17
                key={tag.tagId}
                className="tag"
              >
                {tag.tagName}
              </Link>
            ))}
          </div>

          <div className="purchase-area">
            <div className="purchase-box">
              <div className="price-label">Buy {game.name}</div>
              <div className="price-action">
                {game.price > 0 ? (
                  <span className="price">${game.price.toFixed(2)}</span>
                ) : (
                  <span className="price">Free to Play</span>
                )}
                if (condition) {
                  
                }
                <button onClick={addCartHandler} className="add-to-cart-button">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === PHẦN DƯỚI: MÔ TẢ ĐẦY ĐỦ VÀ YÊU CẦU HỆ THỐNG === */}
      <div className="bottom-content-container">
        <div className="full-description-section">
          <h2>ABOUT THIS GAME</h2>
          {/* Dùng dangerouslySetInnerHTML để render HTML nếu có, hoặc đơn giản là <p> */}
          <div
            className="description-body"
            dangerouslySetInnerHTML={{
              __html: game.fullDescription.replace(/\n/g, "<br />"),
            }}
          />
        </div>

        <div className="system-requirements-section">
          <h2>SYSTEM REQUIREMENTS</h2>
          <div className="requirements-grid">
            <strong>OS:</strong> <span>{game.os || "N/A"}</span>
            <strong>Processor:</strong> <span>{game.processor || "N/A"}</span>
            <strong>Memory:</strong> <span>{game.memory || "N/A"}</span>
            <strong>Graphics:</strong> <span>{game.graphics || "N/A"}</span>
            <strong>Storage:</strong> <span>{game.storage || "N/A"}</span>
            {game.additionalNotes && (
              <>
                <strong>Additional Notes:</strong>{" "}
                <span>{game.additionalNotes}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* === PHẦN REVIEW === */}
      <div className="review-section-container">
        <h2>CUSTOMER REVIEWS</h2>
        <Review gameId={gameId} />
      </div>
    </div>
  );
};

export default GameDetail;
