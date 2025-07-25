import React, { useState, useEffect, useRef } from 'react';
import PublisherGameItem from '../../../components/PublisherGameItem/PublisherGameItem';
import SearchBarPublisher from '../../../components/SearchBarPublisher/SearchBarPublisher';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GameDeclined() {
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const size = 10;

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/game/publisher/declined`, {
        params: { page, size, name: searchTerm.trim() }
      });

      const newGames = res.data.content;
      setGames(prev => (page === 0 ? newGames : [...prev, ...newGames]));
      setHasMore(!res.data.last);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Failed to fetch games", err);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchGames();
      hasFetchedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(0);
      setGames([]);
      hasFetchedRef.current = false;
      fetchGames();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setGames([]);
    setPage(0);
    hasFetchedRef.current = false;
    console.log(term)
  };

  const handleRedirect = (requestId, action) => {
    if (action === "Edit") navigate(`/edit-game/${requestId}`);
    else if (action === "View") navigate(`/publisher/game/detail/${requestId}`);
  };
  const handleRemove = async (requestId) => {
    const confirm = window.confirm("Are you sure you want to remove this game request?");
    if (!confirm) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/request/game/delete/${requestId}`);
      setGames(games.filter(game => game.requestId !== requestId));
    } catch (err) {
      console.error("Failed to remove game", err);
    }
  };
  return (
    <div className='game-approved-container'>
      <SearchBarPublisher onSearch={handleSearch} />
      <InfiniteScroll
        dataLength={games.length}
        next={fetchGames}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {games.map(game => (
          <PublisherGameItem
            key={game.requestId}
            thumbnail={game.mediaUrls[0]}
            title={game.gameName}
            action1="Edit"
            action2="Remove"
            action3="View"
            onAction1Click={() => handleRedirect(game.requestId, "Edit")}
            onAction2Click={() => handleRemove(game.requestId)}
            onAction3Click={() => handleRedirect(game.requestId, "View")}
            time={new Date(game.sendDate).toLocaleDateString()}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default GameDeclined;