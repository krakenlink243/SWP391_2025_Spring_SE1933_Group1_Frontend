import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Thêm Link cho breadcrumb
import "./GameDetail.css";
import Review from "../../components/Review/Review";
import axios from "axios";

// Added by Phan NT Son
import DetailHeader from "./DetailHeader";
import DetailBody from "./DetailBody";
import DetailSystem from "./DetailSystem";

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

  // Moved to Detail Header by Phan NT Son 15-06-2025

  // Lấy ảnh bìa (capsule) cho cột thông tin bên phải
  const coverImageUrl =
    game.media?.find((m) => m.type.toLowerCase().includes("header"))?.url ||
    game.media?.[0]?.url ||
    "";

  return (

    // <div className="game-detail-page">
    //   <div className="breadcrumb">
    //     <Link to="/">All Games</Link> &gt; <span>{game.name}</span>
    //   </div>
    //   <h1 className="game-title-header">{game.name}</h1>

    //   <div className="detail-main-content">
    //     {/* === CỘT TRÁI - MEDIA === */}
    //     <div className="media-column">
    //       {activeMedia && (
    //         <div className="main-media-banner">
    //           {activeMedia.type.toLowerCase().includes("video") ? (
    //             <video
    //               src={activeMedia.url}
    //               controls
    //               autoPlay
    //               muted
    //               loop
    //               key={activeMedia.mediaId}
    //             />
    //           ) : (
    //             <img
    //               src={activeMedia.url}
    //               alt="Game banner"
    //               key={activeMedia.mediaId}
    //             />
    //           )}
    //         </div>
    //       )}
    //       <div className="media-thumbnail-strip">
    //         {game.media.map((mediaItem) => (
    //           <div
    //             key={mediaItem.mediaId}
    //             className={`thumbnail-container ${
    //               activeMedia?.mediaId === mediaItem.mediaId ? "active" : ""
    //             }`}
    //             onClick={() => handleThumbnailClick(mediaItem)}
    //           >
    //             <img
    //               src={mediaItem.url}
    //               alt="Game thumbnail"
    //               className="thumbnail"
    //             />
    //           </div>
    //         ))}
    //       </div>
    //     </div>

    //     {/* === CỘT PHẢI - THÔNG TIN & MUA HÀNG === */}
    //     <div className="info-column">

    //       <p className="short-description">{game.shortDescription}</p>

    //       <div className="info-grid">
    //         <div className="info-row">
    //           
    //         </div>
    //         <div className="info-row">

    //         </div>
    //       </div>

    //       <div className="tag-list-detail">

    //       </div>

    //       <div className="purchase-area">

    //       </div>
    //     </div>
    //   </div>

    //   {/* === PHẦN DƯỚI: MÔ TẢ ĐẦY ĐỦ VÀ YÊU CẦU HỆ THỐNG === */}
    //   <div className="bottom-content-container">
    //     <div className="full-description-section">

    //     </div>

    //     <div className="system-requirements-section">

    //     </div>
    //   </div>

    //   {/* === PHẦN REVIEW === */}
    //   <div className="review-section-container">
    //     <h2>CUSTOMER REVIEWS</h2>
    //     <Review gameId={gameId} />
    //   </div>
    // </div>

    /**
     * @author Phan NT Son
     * @since 15-06-2025
     * @status pending
     */
    <div className="container-fluid">
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className=" col-lg-8 text-white">
          <DetailHeader
            game={game}
          />
          <DetailBody
            game={game}
          />
          <DetailSystem
            game={game}
          />
        </div>
      </div>
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className="col-lg-8">
          <Review
            game={game}
          />
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
