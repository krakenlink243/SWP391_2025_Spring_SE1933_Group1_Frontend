import React from "react";
import "./GameCard.css"; // CSS cho GameCard

const GameCard = ({ game }) => {
  // const gameId = game.id; 
  const date = new Date(game.releaseDate);
  const formattedDate = `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}, ${date.getFullYear()}`;
  return (
    <div className="game-card d-flex align-items-center">
      <img
        src={game.imageUrl || "https://via.placeholder.com/150"}
        alt={game.title}
        className="game-card-thumbnail"
      />
      <div className="game-card-info d-flex flex-row align-items-center mx-2">
        <h3 className="game-card-title w-50">{game.title}</h3>
        <div className="game-card-date w-25">
          {formattedDate}
        </div>

        {game.price < game.originalPrice ? (
          // {1 < game.originalPrice ? (
          <div className="game-card-prices have-discount">
            <div className="original-price">
              ${game.originalPrice.toFixed(2)}

            </div>
            <div className="current-price">
              ${game.price.toFixed(2)}
            </div>
          </div>
        ) : (
          <div className="game-card-prices">
            {game.originalPrice == 0 ? (
              <div>
                <div className="current-price">
                  Free
                </div>
              </div>
            ) : (
              <div>
                <div className="current-price">
                  ${game.originalPrice.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
