import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Library.css";


/**
 * @author BaThanh
 * @description Component for showing cart, removing games from cart, and checkout cart.
 * @param {*} param0 
 * @returns 
 */


const Library = () => {
  const userId = localStorage.getItem("userId");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="library-bg">
      <div className="library-main">
        <h2 className="library-title">My Library</h2>
        {loading ? (
          <div className="library-loading">Loading...</div>
        ) : games.length === 0 ? (
          <div className="library-empty">You have not purchased any games yet.</div>
        ) : (
          <div className="library-list">
            {games.map((game) => (
              <div className="library-game-card" key={game.gameId}>
                <div className="library-game-header">
                  <span className="library-game-title">{game.name}</span>
                  <span className="library-game-price">${game.price}</span>
                </div>
                <div className="library-game-info">
                  <span className="library-game-publisher">{game.publisher?.publisherName}</span>
                  <span className="library-game-release">Release: {game.releaseDate}</span>
                </div>
                <div className="library-game-desc">{game.shortDescription}</div>
                <div className="library-game-tags">
                  {game.tags && Array.isArray(game.tags)
                    ? game.tags.map((tag) => (
                        <span className="library-game-tag" key={tag.tagId}>
                          {tag.tagName}
                        </span>
                      ))
                    : null}
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