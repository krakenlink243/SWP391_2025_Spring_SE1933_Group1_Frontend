import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Library.css";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/validators";
import { useAuth } from "../../context/AuthContext";
import { AppContext } from "../../context/AppContext";

const sortOptions = [
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
  { value: "priceLowHigh", label: "Price (Low to High)" },
  { value: "priceHighLow", label: "Price (High to Low)" },
];



const Library = () => {

  const { token } = useAuth();
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("az");
  const { library, libraryLoading } = useContext(AppContext);

  if (!token || isTokenExpired()) {
    navigate("/");
    return null;
  }

  const getSortedGames = () => {
    const sorted = [...library];
    switch (sortBy) {
      case "az":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "priceLowHigh":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return sorted;
  };

  return (
    <div className="library-layout">
      <div className="library-sidebar">
        <div className="library-sidebar-title">All Games ({library.length})</div>
        <ul className="library-game-list">
          {getSortedGames().map((game) => (
            <li
              key={game.gameId}
              className="library-game-list-item"
              onClick={() => navigate(`/game/${game.gameId}`)}
            >
              {game.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="library-content">
        <h2 className="library-title">
          {username ? `${username}'s Library` : "My Library"}
        </h2>
        <div className="library-filter-row">
          <label htmlFor="library-sort" className="library-filter-label">
            Sort by:
          </label>
          <select
            id="library-sort"
            className="library-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((opt) => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {libraryLoading ? (
          <div className="library-loading">Loading...</div>
        ) : library.length === 0 ? (
          <div className="library-empty">
            You have not purchased any games yet.
          </div>
        ) : (
          <div className="library-grid">
            {getSortedGames().map((game) => (
              <div
                className="library-game-card"
                key={game.gameId}
                onClick={() => navigate(`/game/${game.gameId}`)}
              >
                <div className="library-game-image-container">
                  <div className="media-with-caption">
                    <img
                      className="library-game-image"
                      src={
                        game.media && game.media.length > 0
                          ? game.media[0].url
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcIgF8vDI5cJMjYmRzfS3rOUWA-M9kw0iWRQ&s"
                      }
                      alt={game.name}
                    />
                  </div>
                </div>
                <div className="library-game-name">{game.name}</div>
                <div className="library-game-played-time">
                  {(game.playtimeInMillis / 60000).toFixed(1)} minutes played
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
