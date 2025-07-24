import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchBarPublisher from '../../../components/SearchBarPublisher/SearchBarPublisher';
import PublisherGameItem from '../../../components/PublisherGameItem/PublisherGameItem';

export default function GameApproved() {
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const [games, setGames] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const size = 5;

  // Fetch paginated game list
  const fetchGames = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/game/publisher/listed`, {
        params: { page, size, name: searchTerm.trim() },
      });

      const newGames = response.data.content;
      setGames(prev => page === 0 ? newGames : [...prev, ...newGames]);
      setHasMore(!response.data.last);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error("Failed to fetch games", error);
    }
  };

  // Initial load
  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchGames();
      hasFetchedRef.current = true;
    }
  }, []);

  // Trigger search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(0);
      setGames([]);
      fetchGames();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Search callback
  const handleSearch = (term) => {
    setSearchTerm(term);
    setGames([]);
    setPage(0);
    hasFetchedRef.current = false;
  };

  // Navigation handler
  const handleRedirect = (gameId, action) => {
    if (action === "Update") navigate(`/update-game/${gameId}`);
    if (action === "News") navigate(`/news/${gameId}`);
  };

  // Toggle Hide/Unhide logic
  const toggleGameVisibility = async (gameId, isVisible) => {
    const confirmMsg = isVisible
      ? "Are you sure you want to hide this game?"
      : "Are you sure you want to unhide this game?";
    if (!window.confirm(confirmMsg)) return;

    const endpoint = isVisible ? "hide" : "unhide";
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/game/${endpoint}/${gameId}`);

      // Update state instantly for UI sync
      setGames(prev =>
        prev.map(game =>
          game.id === gameId
            ? { ...game, state: !isVisible }
            : game
        )
      );
    } catch (error) {
      console.error(`Failed to ${endpoint} game`, error);
    }
  };

  return (
    <div className="game-approved-container">
      <SearchBarPublisher onSearch={handleSearch} />
      <InfiniteScroll
        dataLength={games.length}
        next={fetchGames}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {games.map((game) => (
          <PublisherGameItem
            key={`${game.id}-${game.state}`} // 🔁 re-render when visibility changes
            thumbnail={game.imageUrl}
            title={game.title}
            action1="Update"
            action2={game.state ? "Hide" : "Unhide"}
            action3="News"
            onAction1Click={() => handleRedirect(game.id, "Update")}
            onAction2Click={() => toggleGameVisibility(game.id, game.state)}
            onAction3Click={() => handleRedirect(game.id, "News")}
            time={new Date(game.releaseDate).toLocaleDateString()}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}