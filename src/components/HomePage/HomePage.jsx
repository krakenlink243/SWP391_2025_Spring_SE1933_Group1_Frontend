// src/pages/HomePage.jsx
import React from "react";
// import SideNav from "../components/HomePage/SideNav";
// import HeroCarousel from "../components/HomePage/HeroCarousel";

import "./HomePage.css";
/**
 * Remake by Phan NT Son 
 * @since 14-06-2025
 * @returns 
 */
const HomePage = () => {
  return (
    <div className="home-container">
      <div className="banner">
        <video
          loop
          autoPlay
          muted
          playsInline
          preload="none"
          id="top-promo-video"
          className="d-block w-100"
          alt="Top Promo Banner"
        >
          <source
            src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/clusters/frontpage/e605d9023731d9b5b9ec448e/webm_page_bg_vietnamese.webm?t=1748898349"
            type="video/webm"
          />
        </video>
      </div>

      <div className="browse-tags">

      </div>
      <div className="free-to-play">

      </div>
      <div className="new-published">

      </div>
      <div className="top-sellers">

      </div>
    </div>
  );
};

export default HomePage;
