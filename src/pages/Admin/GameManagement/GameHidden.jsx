import React from 'react'
import PublisherGameItem from '../../../components/PublisherGameItem/PublisherGameItem';
import SearchBarPublisher from '../../../components/SearchBarPublisher/SearchBarPublisher';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '../../../services/notification';
function GameHidden() {
    const [games, setGames] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const size = 10;
    const fetchGames = async () => {
        try {
            const response = await axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/game/hidden`, {
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
  const handleUnhide = async (gameId,publisherId,gameName) => {
    const confirm = window.confirm('Are you sure you want to unhide this game?');
    if (!confirm) {
      return;
    }
    try {
      await axios.patch(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/game/unhide/${gameId}`, {
      });
      createNotification(publisherId,"Game Management",`Your Game ${gameName} has been re-listed from hide state.`)
      setGames(prev => prev.filter(game => game.id !== gameId));
    } catch (error) {
      console.error('Error unhiding game:', error);
    }
  };
  return (
    <div className='game-hidden-container'>
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
            action2="Unhide"
            onAction2Click={() => handleUnhide(game.id,game.publisherId,game.title)}
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}

export default GameHidden
