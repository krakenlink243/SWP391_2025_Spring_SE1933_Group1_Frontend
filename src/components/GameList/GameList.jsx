import React, { useState, useEffect } from "react";
import GameCard from "../GameCard/GameCard";
import "./GameList.css";
import axios from "axios";
import { Link, Routes } from "react-router";

const GameList = () => {
  const [games, setGames] = useState([]); // State để lưu danh sách game
  const [loading, setLoading] = useState(true); // State cho trạng thái tải
  const [error, setError] = useState(null); // State cho lỗi (nếu có)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:8080/game");
        setGames(response.data);
      } catch (e) {
        console.error("Failed to fetch games:", e);
        setError(e.message);
      } finally {
        // Dù thành công hay thất bại, kết thúc trạng thái tải
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Hiển thị thông báo đang tải
  if (loading) {
    return <div className="loading-message">Loading games...</div>;
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="error-message">
        Error fetching games: {error}. Please make sure your backend is running
        and accessible.
      </div>
    );
  }

  if (games.length === 0) {
    return <div className="no-games-message">No games found.</div>;
  }

  // Hiển thị danh sách game
  return (
    <div className="game-list-container">
      {games.map((game) => (
        <Link to={`/game/${game.id || game._id}`} key={game.id || game._id}>
          <GameCard key={game.id || game._id} game={game} />
        </Link>
      ))}
    </div>
  );
};

export default GameList;
