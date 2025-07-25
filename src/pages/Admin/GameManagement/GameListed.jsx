import React from 'react'
import PublisherGameItem from '../../../components/PublisherGameItem/PublisherGameItem';
import SearchBarPublisher from '../../../components/SearchBarPublisher/SearchBarPublisher';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '../../../services/notification';
function GameListed() {
    const [games, setGames] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const size = 10;
    const fetchGames = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/game/listed`, {
                params: {
                    page,
                    size,
                    name: searchTerm.trim()
                }
            });
            console.log(response.data);
            const newGames = response.data.content;
            setGames(prev => (page===0? newGames : [...prev, ...newGames]));
            setHasMore(!response.data.last);
            setPage(page + 1);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };
    useEffect(() => {
      fetchGames();
  }, []);
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(0);
      setGames([]);
      fetchGames();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);
  const handleSearch = (term) => {
    setSearchTerm(term);
    setGames([]);
    setPage(0);
    console.log(term)
  };
  const handleHide = async (gameId,publisherId) => {
    const confirm = window.confirm('Are you sure you want to hide this game?');
    if (!confirm) {
      return;
    }
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/game/hide/${gameId}`, {
      });
      createNotification(publisherId,"Game Management","Someone reported that your game has violated the Term of Service.To object this report, send feedback to us.")
      setGames(prev => prev.filter(game => game.id !== gameId));
    } catch (error) {
      console.error('Error hiding game:', error);
    }
  };
  const redirect = (gameId) => {
    navigate(`/game/${gameId}`);
  }
  return (
    <div className='game-listed-container'>
      <SearchBarPublisher onSearch={handleSearch} />

      <InfiniteScroll
        dataLength={games.length}
        next={fetchGames}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scroll-area"
      >
        {games.map((game) => (
          <PublisherGameItem
            key={game.id}
            thumbnail={game.imageUrl}
            title={game.title}
            action1="View"
            action2="Hide"
            onAction2Click={() => handleHide(game.id,game.publisherId)}
            onAction1Click={() => redirect(game.id)}
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default GameListed
