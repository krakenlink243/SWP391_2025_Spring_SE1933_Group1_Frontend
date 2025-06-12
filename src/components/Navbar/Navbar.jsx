import React from "react";
import { FiSearch } from "react-icons/fi"; // Import icon search từ react-icons
import "./Navbar.css"; // Hoặc Navbar.module.css nếu dùng CSS Modules
import SearchBar from "../SearchBar/SearchBar"; // Import component SearchBar
const Navbar = () => {
  return (
    <nav className="steam-navbar-secondary">
      <div className="navbar-links-container">
        <a href="/game" className="nav-item">
          Your Store
        </a>
        <a href="/" className="nav-item">
          New & Noteworthy
        </a>
        <a href="/" className="nav-item">
          Categories
        </a>
        <a href="/" className="nav-item">
          Points Shop
        </a>
        <a href="/" className="nav-item">
          News
        </a>
        <a href="/" className="nav-item">
          Labs
        </a>
      </div>
      <div className="search-bar-container">
        <SearchBar />
      </div>
    </nav>
  );
};

export default Navbar;
