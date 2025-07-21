import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Thêm Link cho breadcrumb
import "./GameDetail.css";
import Review from "../../components/Review/Review";
import axios from "axios";
import { useTranslation } from "react-i18next";

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
  const [isShowPopup, setIsShowPopup] = useState(false);
  const {t} = useTranslation();
  useEffect(() => {
    if (isShowPopup) {
      document.body.style.overflow = 'hidden'; // Disable scroll when popup is open
    }
    else {
      document.body.style.overflow = ''; // Enable scroll when popup is closed
    }
    return () => {
      document.body.style.overflow = ''; // Ensure scroll is enabled when component unmounts
    }
  }, [isShowPopup]);

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
    return <div className="loading-message">{t('Loading game details...')}</div>;
  if (error)
    return (
      <div className="error-message">{t('Error fetching game details:')}{error}</div>
    );
  if (!game) return <div className="not-found-message">{t('Game not found.')}</div>;

  return (

    /**
     * @author Phan NT Son
     * @since 15-06-2025
     * @status done
     */
    <div className="game-detail container-fluid">
      <DetailHeader
        game={game}
        setIsOpenPopup={setIsShowPopup} // Pass the function to set popup state
      />
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className=" col-lg-8 text-white">

          <DetailBody
            game={game}
          />

        </div>
      </div>
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className=" col-lg-8 text-white">

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
