import React from 'react'
import PublisherGameItem from '../../../components/PublisherGameItem/PublisherGameItem'
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
function GamePending() {
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const size = 5;
  const fetchGames = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/game/publisher/pending`, {
        params: { page, size }
      });
      const newGames = res.data.content;
      console.log(newGames)
      setGames(prev => [...prev, ...newGames]);
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
  const handleNavigate = (gameId) => {
    navigate(`/publisher/game/detail/${gameId}`);
  }
  return (
    <div className='game-approved-container'>
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
            onAction3Click={() => handleNavigate(game.requestId)}
            time={new Date(game.sendDate).toLocaleDateString()}
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}
export default GamePending
