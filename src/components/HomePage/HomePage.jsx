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
      {/* <div id="mediaCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">


          <div class="carousel-item active">
            
          </div>


          <div class="carousel-item">
            <img
              className="d-block w-100"
                  src="https://ssj3fox.com/wp-content/uploads/2024/06/page_bg_variant_webm_english_summer.webm_snapshot_00.02.803.jpg"
              alt="Bottom Promo Banner"
            />
          </div>

        </div>


        <button class="carousel-control-prev" type="button" data-bs-target="#mediaCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>

        <button class="carousel-control-next" type="button" data-bs-target="#mediaCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div> */}

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
