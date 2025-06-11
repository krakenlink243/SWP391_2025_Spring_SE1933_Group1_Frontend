import React from "react";
import GameCard from "../GameCard/GameCard";
import "./GameList.css";
import { Link } from "react-router-dom"; // Sửa lại import cho đúng

const GameList = ({
  games,
  loading,
  error,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  if (loading) {
    return <div className="message-info">Loading games...</div>;
  }

  if (error) {
    return (
      <div className="message-error">
        Error: {error}. Please make sure your backend is running.
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="message-info">No games found matching your criteria.</div>
    );
  }

  // Nếu có dữ liệu, hiển thị danh sách game và phân trang
  return (
    <div className="game-list-container">
      <div className="games-grid">
        {games.map((game) => (
          <Link
            to={`/game/${game.id}`}
            key={game.id}
            className="game-link"
          >
            <GameCard game={game} />
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={onPrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={onNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default GameList;
