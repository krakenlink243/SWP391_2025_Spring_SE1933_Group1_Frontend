import React from "react";
import GameCard from "../GameCard/GameCard";
import "./GameList.css";
import { Link } from "react-router-dom";

const GameList = ({ games, loading, error }) => {
  if (loading) return <div className="message-info">Loading games...</div>;
  if (error) return <div className="message-error">Error: {error}.</div>;
  if (!games || games.length === 0)
    return <div className="message-info">No games found.</div>;

  return (
    <div className="games-grid">
      {games.map((game) => (
        <Link to={`/game/${game.id}`} key={game.id} className="game-link">
          <GameCard game={game} />
        </Link>
      ))}
    </div>
  );
};

export default GameList;
