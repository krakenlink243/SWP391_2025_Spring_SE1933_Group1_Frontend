import React from "react";
import { FiSearch } from "react-icons/fi"; // Import icon search từ react-icons
import "./Navbar.css"; // Hoặc Navbar.module.css nếu dùng CSS Modules
import SearchBar from "../SearchBar/SearchBar"; // Import component SearchBar
import { Navigate, useNavigate } from 'react-router-dom';

/**
 * Origin @author: TS Huy
 * Refactor and re-design @author: Phan NT Son
 * @returns 
 */
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid store-header" role="navigation">
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className="col-lg-8">
          <div className="content">
            <div className="store-nav-area">
              <div className="store-nav-bg">
                <div className="store-nav">
                  <div className="tab" onClick={() => navigate("/game")}><span className="pulldown"><a>Your Store</a></span></div>
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

        <div className="spacer col-lg-2"></div>

      </div>

    </div>
  );
};

export default Navbar;
