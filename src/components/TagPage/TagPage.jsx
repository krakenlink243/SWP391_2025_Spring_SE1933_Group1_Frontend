import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import GameList from "../GameList/GameList"; // Tái sử dụng GameList
import Pagination from "../Pagination/Pagination";
import "../CategoryPage.css"; // Dùng chung CSS cho cả Tag và Publisher

const TagPage = () => {
  const { tagId } = useParams();
  const [tagInfo, setTagInfo] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTagData = useCallback(async () => {
    setLoading(true);
    try {
      const [tagInfoResponse, gamesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/tags/${tagId}`),
        axios.get(
          `${import.meta.env.VITE_API_URL}/game/tag/${tagId}?page=${currentPage}&size=12`
        ),
      ]);

      setTagInfo(tagInfoResponse.data);
      setGames(gamesResponse.data.content || []);
      setTotalPages(gamesResponse.data.totalPages || 0);
    } catch (err) {
      setError("Failed to load data for this tag.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tagId, currentPage]);

  useEffect(() => {
    fetchTagData();
  }, [fetchTagData]);

  if (loading)
    return <div className="category-page-status">Loading games...</div>;
  if (error) return <div className="category-page-status error">{error}</div>;

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>Games tagged with "{tagInfo?.tagName}"</h1>
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

export default TagPage;
