import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./SimilarByTags.css";

const SimilarByTag = ({ gameId }) => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/game/related/tags/${gameId}`);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching similar games:", error);
      }
    };

    fetchRecommendations();
  }, [gameId]);

  const visibleGames = games.slice(page * 5, page * 5 + 5);

  return (
    <div className="similar-carousel w-100">
        {/* <div className="section-header"> */}
            <h2 style={{fontSize: 'medium'}}>GAME YOU MAY LIKE</h2>

        {/* </div> */}
      <div className="line-seperate w-100"></div>
      <div className="carousel-track">
        {visibleGames.map((game) => (
          <Link key={game.id} to={`/game/${game.id}`} className="carousel-card">
            <div className="carousel-thumbnail-wrapper">
              <img src={game.imageUrl} alt={game.title} className="carousel-thumbnail" />
              {game.originalPrice > game.price && (
                <div className="discount-badge">
                  -{Math.round(100 - (game.price / game.originalPrice) * 100)}%
                </div>
              )}
            </div>
            <div className="carousel-title">{game.title}</div>
            <div className="carousel-price">
              {game.originalPrice === 0
                ? "Free"
                : game.originalPrice > game.price
                ? (
                  <>
                    <span className="original">${game.originalPrice.toFixed(2)}</span>
                    <span className="discounted">${game.price.toFixed(2)}</span>
                  </>
                )
                : `$${game.price.toFixed(2)}`
              }
            </div>
          </Link>
        ))}
      </div>

      <div className="carousel-controls">
        <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>←</button>
        <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * 5 >= games.length}>→</button>
      </div>
    </div>
  );
};

export default SimilarByTag;