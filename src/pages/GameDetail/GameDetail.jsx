import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Thêm Link cho breadcrumb
import "./GameDetail.css";
import Review from "../../components/Review/Review";
import axios from "axios";

// Added by Phan NT Son
import DetailHeader from "./DetailHeader";
import DetailBody from "./DetailBody";
import DetailSystem from "./DetailSystem";
import { useLocalStorage } from "../../hooks/useLocalStorage";

// add by Bathanh
const userId = localStorage.getItem("userId");

const isStale = (timestamp) => {
  const TEN_MINUTES = 10 * 60 * 1000;
  return Date.now() - timestamp > TEN_MINUTES;
};

const GameDetail = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cachedGameDetail, setCachedGameDetail] = useLocalStorage(`gameDetail_${gameId}`, null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/game/detail/${gameId}`);
        const data = response.data;

        setGame(data);
        setCachedGameDetail({
          timestamp: Date.now(),
          data
        })

      } catch (e) {
        console.error("Failed to fetch game details:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (cachedGameDetail?.data && !isStale(cachedGameDetail.timestamp)) {
      setGame(cachedGameDetail.data);
      setLoading(false);
    } else if (gameId) {
      fetchGameDetails();
    }
  }, [gameId]);

  if (loading)
    return <div className="loading-message">Loading game details...</div>;
  if (error)
    return (
      <div className="error-message">Error fetching game details: {error}</div>
    );
  if (!game) return <div className="not-found-message">Game not found.</div>;

  return (

    /**
     * @author Phan NT Son
     * @since 15-06-2025
     * @status done
     */
    <div className="game-detail container-fluid">
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className=" col-lg-8 text-white">
          <DetailHeader
            game={game}
          />
          <DetailBody
            game={game}
          />
          <DetailSystem
            game={game}
          />
        </div>
      </div>
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className="col-lg-8">
          <Review
            game={game}
          />
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
