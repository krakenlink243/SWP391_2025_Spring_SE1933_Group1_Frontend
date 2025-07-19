import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchBarPublisher from '../../../components/SearchBarPublisher/SearchBarPublisher';
import PublisherGameItem from '../../../components/PublisherGameItem/PublisherGameItem';

function GameApproved() {
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const [games, setGames] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const size = 5;

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/game/publisher/listed`, {
        params: { page, size, name: searchTerm }
      });
      console.log(res.data)
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
    const debounceTimer = setTimeout(() => {
      setPage(0);
      setGames([]);
      fetchGames();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setGames([]);
    setPage(0);
    hasFetchedRef.current = false;
    console.log(term)
  };

  const handleRedirect = (gameId, action) => {
    if (action === "Update") navigate(`/update-game/${gameId}`);
    else if (action === "Hide") navigate(`/hide-game/${gameId}`);
    else if (action === "View") navigate(`/game/${gameId}`);
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
            key={game.id}
            thumbnail={game.imageUrl}
            title={game.title}
            action1="Update"
            action2="Hide"
            action3="View"
            onAction1Click={() => handleRedirect(game.id, "Update")}
            onAction2Click={() => handleRedirect(game.id, "Hide")}
            onAction3Click={() => handleRedirect(game.id, "View")}
            time={new Date(game.releaseDate).toLocaleDateString()}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default GameApproved;

