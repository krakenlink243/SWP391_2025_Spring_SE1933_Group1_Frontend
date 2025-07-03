import React from "react";
import "./YoutubePlayer.css"; // File CSS riêng cho component này

const YouTubePlayer = ({ videoId, title }) => {
  if (!videoId) {
    return <div>Video ID is missing.</div>;
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
