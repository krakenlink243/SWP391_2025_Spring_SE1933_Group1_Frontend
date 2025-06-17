import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Library.css";

const sortOptions = [
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
  { value: "priceLowHigh", label: "Price (Low to High)" },
  { value: "priceHighLow", label: "Price (High to Low)" }
];

const Library = () => {
  const userId = localStorage.getItem("userId");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("az");

  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
      return;
    }
    axios
      .get(`http://localhost:8080/users/${userId}/library`)
      .then((res) => {
        setGames(res.data.library || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  // Sorting logic
  const getSortedGames = () => {
    const sorted = [...games];
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
        <div className="library-sidebar-title">All Games ({games.length})</div>
        <ul className="library-game-list">
          {getSortedGames().map((game) => (
            <li key={game.gameId} className="library-game-list-item">
              {game.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="library-content">
        <h2 className="library-title">My Library</h2>
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
        {loading ? (
          <div className="library-loading">Loading...</div>
        ) : games.length === 0 ? (
          <div className="library-empty">You have not purchased any games yet.</div>
        ) : (
          <div className="library-grid">
            {getSortedGames().map((game) => (
              <div className="library-game-card" key={game.gameId}>
                <div className="librar  game-image-container">
                  <img
                    className="library-game-image"
                    src={
                      game.media && game.media.length > 0
                        ? game.media[0].url
                        : "https://play-lh.googleusercontent.com/EicDCzuN6l-9g4sZ6uq0fkpB-1AcVzd6HeZ6urH3KIGgjw-wXrrtpUZapjPV2wgi5R4"
                    }
                    alt={game.name}
                  />
                </div>
                <div className="library-game-name">{game.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;