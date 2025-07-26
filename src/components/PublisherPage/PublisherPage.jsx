import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import GameList from "../GameList/GameList";
import Pagination from "../Pagination/Pagination";
import "../CategoryPage.css"; // Dùng chung CSS

const PublisherPage = () => {
  const { publisherId } = useParams();
  const [publisherInfo, setPublisherInfo] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPublisherData = useCallback(async () => {
    setLoading(true);
    try {
      const [publisherInfoResponse, gamesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/publisher/${publisherId}`),
        axios.get(
          `${import.meta.env.VITE_API_URL}/game/publisher/${publisherId}?page=${currentPage}&size=12`
        ),
      ]);

      setPublisherInfo(publisherInfoResponse.data);
      setGames(gamesResponse.data.content || []);
      setTotalPages(gamesResponse.data.totalPages || 0);
    } catch (err) {
      setError("Failed to load data for this publisher.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [publisherId, currentPage]);

  useEffect(() => {
    fetchPublisherData();
  }, [fetchPublisherData]);

  if (loading)
    return <div className="category-page-status">Loading games...</div>;
  if (error) return <div className="category-page-status error">{error}</div>;

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>Games from {publisherInfo?.publisherName}</h1>
      </div>
      <GameList games={games} loading={false} error={null} />
      <Pagination
        currentPage={currentPage + 1}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PublisherPage;
