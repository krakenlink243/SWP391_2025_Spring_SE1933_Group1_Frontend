import React from "react";
import "./YoutubePlayer.css"; // Assuming you have some styles for the player
import { useTranslation } from "react-i18next";
const YouTubePlayer = ({ videoId, title }) => {
  const {t} = useTranslation();
  if (!videoId) {
    return <div>{t('Video ID is missing.')}</div>;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`;

  return (
    <div className="video-player-wrapper">
      <iframe
        src={embedUrl}
        title={title || "YouTube video player"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
export default YouTubePlayer;
