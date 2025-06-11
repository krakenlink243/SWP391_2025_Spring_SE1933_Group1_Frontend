// src/pages/HomePage.jsx
import React from "react";
// import SideNav from "../components/HomePage/SideNav";
// import HeroCarousel from "../components/HomePage/HeroCarousel";

import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="app-container">
      <video
        loop
        autoPlay
        muted
        playsInline
        preload="none"
        id="top-promo-video"
        className="fullscreen-video"
        alt="Top Promo Banner"
      >
        <source
          src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/clusters/frontpage/e605d9023731d9b5b9ec448e/webm_page_bg_vietnamese.webm?t=1748898349"
          type="video/webm"
        />
      </video>

      <div className="page-content-constrained-wrapper">
        <div className="homepage-content">
          <div className="slider-section">
          </div>

          <div className="homepage-main-section">
            <div className="homepage-right-column">
              <div className="bottom-promo-banner">
                <img
                  src="https://ssj3fox.com/wp-content/uploads/2024/06/page_bg_variant_webm_english_summer.webm_snapshot_00.02.803.jpg"
                  alt="Bottom Promo Banner"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
