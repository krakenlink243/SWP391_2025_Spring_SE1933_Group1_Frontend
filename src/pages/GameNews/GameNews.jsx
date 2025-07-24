import React, { useState } from 'react';
import NewsCard from './NewsCard';
import './GameNews.css';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
function GameNews() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/game/news/${gameId}`);
        console.log(response.data);
        setNewsList(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, [gameId]);

  const handleRedirect = () => {
    navigate(`/news/create/${gameId}`);
  };
  const handleNewsDeleted = (deletedId) => {
    setNewsList(prevList => prevList.filter(news => news.newsId !== deletedId));
  };
  const handleNewsUpdated = (updatedNews) => {
    setNewsList(prevList => prevList.map(news => news.newsId === updatedNews.newsId ? updatedNews : news));
  };
  return (
    <div className="game-news-container">
      <h1 className="game-news-title">Game's News</h1>

      <div className="create-news-wrapper">
        <Button className="create-news-btn" label="Create News" color="blue-button" onClick={handleRedirect} />
      </div>

      <div className="news-list">
        {newsList.map((news) => (
          <NewsCard
            key={news.newsId}
            news={news}
            onClick={(newsId) => navigate(`/news/detail/${newsId}`)}
            onDelete={handleNewsDeleted}
          />
        ))} 
      </div>
    </div>
  );
}


export default GameNews;
