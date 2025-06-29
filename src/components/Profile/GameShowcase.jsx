import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./GameShowcase.css";

const GameShowcase = ({ userId, gameCount }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchLibraryGames = async () => {
      setLoading(true);
      try {
        // API endpoint của bạn, không cần tham số phân trang theo yêu cầu
        const response = await axios.get(
          `http://localhost:8080/user/library`
        );

        // SỬA ĐỔI 1: Lấy danh sách game từ `response.data.library`
        setGames(response.data.library || []);
      } catch (error) {
        console.error("Failed to fetch library games:", error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryGames();
  }, [userId]);

  // Phần code xử lý loading không đổi
  if (loading) {
    return (
      <div className="game-showcase-container section-box">
        <h3>
          Games <span>({gameCount ?? 0})</span>
        </h3>
        <div className="showcase-list">
          <p>Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-showcase-container section-box">
      <div className="showcase-header">
        <h3>
          Games <span>({gameCount ?? 0})</span>
        </h3>
        <Link to={`/library`} className="view-all-link">
          View All
        </Link>
      </div>
      <div className="showcase-list">
        {games.length > 0 ? (
          games.map((game) => {
            // SỬA ĐỔI 2: Lấy URL ảnh một cách an toàn từ mảng media
            const imageUrl =
              game.media?.[0]?.url ||
              "https://via.placeholder.com/184x69.png?text=No+Image";

            return (
              // SỬA ĐỔI 3: Sử dụng đúng tên thuộc tính: game.gameId và game.name
              <Link
                to={`/game/${game.gameId}`}
                key={game.gameId}
                className="showcase-item"
              >
                <img
                  src={imageUrl}
                  alt={game.name}
                  className="showcase-item-image"
                />
                <h4 className="showcase-item-title">{game.name}</h4>
              </Link>
            );
          })
        ) : (
          <p>This user has no games in their library.</p>
        )}
      </div>
    </div>
  );
};

export default GameShowcase;
