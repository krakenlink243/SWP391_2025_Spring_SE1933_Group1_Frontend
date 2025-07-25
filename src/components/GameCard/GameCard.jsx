import React from "react";
import "./GameCard.css"; // CSS cho GameCard
import { useTranslation } from "react-i18next";

const GameCard = ({ game }) => {
  // const gameId = game.id; 
  const date = new Date(game.releaseDate);
  const formattedDate = `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}, ${date.getFullYear()}`;
  const {t} = useTranslation();
  return (
    <div className="game-card d-flex align-items-center justify-content-between">
      <div className="game-card-thumbnail-wrapper">
        <div className="media-with-caption">
          <img
            src={game.imageUrl || "https://via.placeholder.com/150"}
            alt={game.title}
            className="game-card-thumbnail"
          />
        </div>
      </div>

      {/* <div className="game-card-info d-flex flex-row align-items-center mx-2">
        <h3 className="game-card-title w-50">{game.title}</h3>
        <div className="game-card-tag w-25">
          {game.tags.map((tag) => (
            <span key={tag} className="game-tag">
              {tag},
            </span>
          ))}
        </div>
        <div className="game-card-date w-25">
          Released:{formattedDate}
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
                  {t('Free')}
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
      </div> */}
<div className="game-card-info d-flex flex-row align-items-center mx-2">
  <div className="game-title-and-tags w-50">
    <h3 className="game-card-title">{game.title}</h3>
    <div className="game-card-tag">
      {game.tags?.slice(0, 5).join(", ")}
    </div>
  </div>

  <div className="game-card-date w-25">
    Released: {formattedDate}
  </div>

  {game.price < game.originalPrice ? (
    <div className="game-card-prices have-discount">
      <div className="original-price">${game.originalPrice.toFixed(2)}</div>
      <div className="current-price">${game.price.toFixed(2)}</div>
    </div>
  ) : (
    <div className="game-card-prices">
      {game.originalPrice === 0 ? (
        <div className="current-price">{t('Free')}</div>
      ) : (
        <div className="current-price">${game.originalPrice.toFixed(2)}</div>
      )}
    </div>
  )}
</div>
    </div>
  );
};

export default GameCard;
