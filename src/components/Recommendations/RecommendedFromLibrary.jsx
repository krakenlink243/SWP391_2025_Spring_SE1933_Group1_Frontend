import { useEffect, useState } from "react";
import axios from "axios";
import GameCard from "../GameCard/GameCard";
import "./RecommendedFromLibrary.css";
import { Link } from "react-router-dom";
const RecommendedFromLibrary = ({ userId }) => {

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) return;
      
      try {
        const response = await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/game/related/owned/${userId}`);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching library-based recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [userId]);

  return (
    <div className="recommend-library">
      <h2 className="section-title">Because you have already bought</h2>


      {loading ? (
        <p className="loading-msg">Loading recommendations...</p>
      ) : games.length === 0 ? (
        <p className="no-recommend-msg">No recommendations yet.</p>
      ) : (
        <div className="game-card-list">
          {games.map((game) => (
            <Link
              to={`/game/${game.id}`}
              key={game.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <GameCard game={game} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedFromLibrary;