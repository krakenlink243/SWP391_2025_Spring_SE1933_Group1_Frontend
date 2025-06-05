import React from "react";
import "./GameCard.css"; // CSS cho GameCard

// Props: game (object chứa thông tin game)
const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <img
        src={game.imageUrl || "/placeholder-game-image.png"}
        alt={game.title}
        className="game-card-thumbnail"
      />
      <div className="game-card-info">
        <h3 className="game-card-title">{game.title}</h3>
        {/* Hiển thị giá gốc và giá khuyến mãi nếu có */}
        {game.discountPrice && game.originalPrice ? (
          <div className="game-card-prices">
            <span className="game-card-original-price">
              ${game.originalPrice.toFixed(2)}
            </span>
            <span className="game-card-discount-price">
              ${game.discountPrice.toFixed(2)}
            </span>
          </div>
        ) : game.price > 0 ? (
          <div className="game-card-prices">
            <span className="game-card-current-price">
              ${game.price.toFixed(2)}
            </span>
          </div>
        ) : (
          <div className="game-card-prices">
            <span className="game-card-current-price">Free to Play</span>
          </div>
        )}
        {/* Bạn có thể thêm các thông tin khác như ngày phát hành, tags,... */}
      </div>
    </div>
  );
};

export default GameCard;
