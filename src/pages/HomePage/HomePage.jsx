// src/pages/HomePage.jsx
import { useEffect } from "react";
// import SideNav from "../components/HomePage/SideNav";
// import HeroCarousel from "../components/HomePage/HeroCarousel";

import "./HomePage.css";
import YouTubePlayer from "./YoutubePlayer";

import BrowseByTag from "./BrowseByTag";
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
              src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/clusters/frontpage/e605d9023731d9b5b9ec448e/webm_page_bg_vietnamese.webm?t=1748898349"
              type="video/webm"
            />
          </video>
        </div>
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8">
            <BrowseByTag />

          </div>
        </div>
        <div className="row">
        </div>
      </div>
    </div>
  );
};

export default HomePage;