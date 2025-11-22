import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import './GameNews.css';
import Button from '../../components/Button/Button';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

function GameNews() {
  const location = useLocation();
  const { mode } = location.state || {};
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameName, setGameName] = useState("");
  const [newsPage, setNewsPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPublisher, setIsPublisher] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsPublisher(role === "Publisher");
  }, []);

  const fetchNews = async (page = 0) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/game/news/${gameId}`,
        { params: { page, size: pageSize } }
      );
      console.log(response.data);
      setGameName((await axios.get(`${import.meta.env.VITE_API_URL}/game/detail/${gameId}`)).data.name);
      console.log(gameName);
      setNewsPage(response.data);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [gameId]);

  const handleRedirect = () => {
    navigate(`/news/create/${gameId}`);
  };

  const handleNewsDeleted = (deletedId) => {
    if (!newsPage) return;
    const updatedContent = newsPage.content.filter(news => news.newsId !== deletedId);
    setNewsPage({ ...newsPage, content: updatedContent });
  };

  const handleNewsUpdated = (updatedNews) => {
    if (!newsPage) return;
    const updatedContent = newsPage.content.map(news =>
      news.newsId === updatedNews.newsId ? updatedNews : news
    );
    setNewsPage({ ...newsPage, content: updatedContent });
  };

  return (
    <div className="game-news-container">
      <h1 className="game-news-title">{gameName}'s News</h1>

      {isPublisher && mode !== "customer" && (
        <div className="create-news-wrapper">
          <Button className="create-news-btn" label="Create News" color="blue-button" onClick={handleRedirect} />
        </div>
      )}

      <div className="news-list">
        {newsPage?.content.map((news) => (
          <NewsCard
            key={news.newsId}
            news={news}
            onClick={(newsId) => navigate(`/news/detail/${newsId}`)}
            onDelete={handleNewsDeleted}
            mode={mode}
          />
        ))}
      </div>

      {newsPage && newsPage.totalPages > 1 && (
        <div className="pagination-controls">
          <Button
            label="Prev"
            color="blue-button"
            onClick={() => fetchNews(currentPage - 1)}
            disabled={currentPage === 0}
          />

          {[...Array(newsPage.totalPages).keys()].map((pageNum) => (
            <Button
              key={pageNum}
              label={`${pageNum + 1}`}
              color={pageNum === currentPage ? "blue-button" : "grey-button"}
              onClick={() => fetchNews(pageNum)}
            />
          ))}

          <Button
            label="Next"
            color="blue-button"
            onClick={() => fetchNews(currentPage + 1)}
            disabled={currentPage === newsPage.totalPages - 1}
          />
        </div>
      )}
    </div>
  );
}

export default GameNews;
