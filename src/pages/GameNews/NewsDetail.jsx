import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './NewsDetail.css';

function NewsDetail() {
  const { newsId } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/game/news/view/${newsId}`);
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  if (loading) return <div className="news-detail-loading">Loading...</div>;
  if (!news) return <div className="news-detail-error">News not found.</div>;

  return (
    <div className="news-detail-wrapper">
      <div className="news-detail-card">
        <h1 className="news-detail-title">{news.title}</h1>
        <p className="news-detail-summary">{news.summary}</p>
        <div
          className="news-detail-content"
          dangerouslySetInnerHTML={{ __html: news.htmlContent }}
        />
      </div>
    </div>
  );
}

export default NewsDetail;
