import React, { useState, useEffect, useRef } from 'react';
import PublisherGameItem from '../../../components/PublisherGameItem/PublisherGameItem';
import SearchBarPublisher from '../../../components/SearchBarPublisher/SearchBarPublisher';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GamePending() {
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const [games, setGames] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const size = 10;

  const fetchGames = async () => {
    try {
      const res = await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/game/publisher/pending`, {
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

  const handleNavigate = (gameId) => {
    navigate(`/publisher/game/detail/${gameId}`);
  };
  const handleRemove = async (requestId) => {
    const confirm = window.confirm("Are you sure you want to remove this game request?");
    if (!confirm) return;
    try {
      await axios.delete(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/request/game/delete/${requestId}`);
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
            action2="Remove"
            action3="View"
            onAction2Click={() => handleRemove(game.requestId)}
            onAction3Click={() => handleNavigate(game.requestId)}
            time={new Date(game.sendDate).toLocaleDateString()}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default GamePending;