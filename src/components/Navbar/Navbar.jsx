import React from "react";
import { FiSearch } from "react-icons/fi"; // Import icon search từ react-icons
import "./Navbar.css"; // Hoặc Navbar.module.css nếu dùng CSS Modules
import SearchBar from "../SearchBar/SearchBar"; // Import component SearchBar
/**
 * Origin @author: TS Huy
 * Refactor and re-design @author: Phan NT Son
 * @returns 
 */
const Navbar = () => {
  return (
    <div className="store-header" role="navigation">
      <div className="content">
        <div className="store-nav-area">
          <div className="store-nav-bg">
            <div className="store-nav">
              <div className="tab"><span className="pulldown"><a href="/game">Your Store</a></span></div>
              <div className="tab"><span className="pulldown"><a>New & Noteworthy</a></span></div>
              <div className="tab"><span className="pulldown"><a>Categories</a></span></div>
              <div className="tab"><span className="pulldown"><a>Points Shop</a></span></div>
              <div className="tab"><span className="pulldown"><a>News</a></span></div>
              <div className="tab"><span className="pulldown"><a>Labs</a></span></div>
              <div className="search-flex-spacer"></div>
              <div className="search-area">
                <SearchBar />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
