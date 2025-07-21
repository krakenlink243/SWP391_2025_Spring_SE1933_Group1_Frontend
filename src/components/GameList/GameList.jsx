import React from "react";
import GameCard from "../GameCard/GameCard";
import "./GameList.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const GameList = ({ games, loading, error }) => {
  const {t} = useTranslation();
  if (loading) return <div className="loading-message">{t('Loading games...')}</div>;
  if (error) return <div className=".error-message">{t('Error')}: {error}.</div>;
  if (!games || games.length === 0)
    return <div className="no-games-message">{t('No games found')}.</div>;

  return (
    <div className="games-container d-flex flex-column">
      {games.map((game) => (
        <Link to={`/game/${game.id}`} key={game.id} className="game-link">
          <GameCard game={game} />
        </Link>
      ))}
    </div>
  );
};

export default GameList;
