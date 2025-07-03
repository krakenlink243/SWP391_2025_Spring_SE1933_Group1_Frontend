// src/pages/HomePage.jsx
import { useEffect } from "react";
// import SideNav from "../components/HomePage/SideNav";
// import HeroCarousel from "../components/HomePage/HeroCarousel";

import "./HomePage.css";
import YouTubePlayer from "./YouTubePlayer";

import BrowseByTag from "./BrowseByTag";
import BrowseByPublisher from "./BrowseByPublisher";
/**
 * Origin belongs to @author TS Huy
 * Remake by Phan NT Son
 * @since 14-06-2025
 * @returns
 */
const HomePage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="banner">
          <video
            loop
            autoPlay
            muted
            playsInline
            preload="none"
            id="top-promo-video"
            className="w-100"
            alt="Top Promo Banner"
          >
            <source
              src="https://shared.fastly.steamstatic.com/store_item_assets/steam/clusters/sale_summer2025/36a01fe4331ab0ca600ff205/webm_page_bg_english.webm?t=1750963512"
              type="video/webm"
            />
          </video>
        </div>
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8">
            <BrowseByTag />
            <div>
              <div className="video-section">
                <h2 className="section-title">Featured Video</h2>
                <YouTubePlayer
                  videoId="EFf1AWnZVW0"
                  title="Featured Gameplay"
                />
              </div>
            </div>
            <BrowseByPublisher />
          </div>
        </div>
        <div className="row"></div>
      </div>
    </div>
  );
};

export default HomePage;
