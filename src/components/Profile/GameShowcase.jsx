import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./GameShowcase.css";

// Component con cho các nút phân trang (Không đổi)
const ShowcasePagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="showcase-pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        &laquo;
      </button>
      <span>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 >= totalPages}
      >
        &raquo;
      </button>
    </div>
  );
};

const GameShowcase = ({ userId, gameCount }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const GAMES_PER_PAGE = 6;

  const fetchLibraryPage = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        size: GAMES_PER_PAGE,
        sort: "dateAdded,desc",
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/library?userId=${userId}&${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const pageData = response.data;
      setGames(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setTotalGames(pageData.totalElements || 0);
    } catch (error) {
      console.error("Failed to fetch library games:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage]);

  useEffect(() => {
    fetchLibraryPage();
  }, [fetchLibraryPage]);

  return (
    <div className="game-showcase section-box">
      <div className="showcase-header">
        <h3>
          Games <span>({totalGames})</span>
        </h3>
        <Link to={`/library`} className="view-all-link">
          View All
        </Link>
      </div>
      <div className="showcase-list">
        {loading ? (
          <p>Loading games...</p>
        ) : games.length > 0 ? (
          // === SỬA LỖI Ở ĐÂY ===
          games.map((libraryItem) => {
            // 1. Lấy ra đối tượng gameDetail từ mỗi item trong thư viện
            const game = libraryItem.gameDetail;

            // 2. Kiểm tra an toàn, nếu không có game detail thì bỏ qua
            if (!game) {
              return null;
            }

            // 3. Lấy URL ảnh từ mảng media một cách an toàn
            const imageUrl =
              game.media?.[0]?.url ||
              "https://via.placeholder.com/184x69.png?text=No+Image";

            return (
              // 4. Sử dụng đúng các thuộc tính: game.gameId và game.name
              <Link
                to={`/game/${game.gameId}`}
                key={game.gameId}
                className="showcase-item"
                title={game.name}
              >
                <div className="media-with-caption">
                  <img
                    src={imageUrl}
                    alt={game.name}
                    className="showcase-item-image"
                  />
                </div>
                <h4 className="showcase-item-title">{game.name}</h4>
              </Link>
            );
          })
        ) : (
          <p>This user has no games to showcase.</p>
        )}
      </div>
      <ShowcasePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default GameShowcase;
