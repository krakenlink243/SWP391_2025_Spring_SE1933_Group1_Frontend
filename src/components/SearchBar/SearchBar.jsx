import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SearchBar.css"; // Sẽ cập nhật file CSS này ở bước 2

import axios from "axios";

const SearchBar = ({ onSearchSubmit }) => {
  // ... (toàn bộ state và logic useEffect, handleSubmit... của bạn giữ nguyên) ...
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/game/search?term=${searchTerm}`
        );
        setSuggestions(response.data || []);
      } catch (error) {
        console.error("Search suggestions failed:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Xử lý khi submit form ---
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(searchTerm);
    setSuggestions([]);
    // SỬA ĐỔI 3: Dùng navigate() thay cho history.push()
    if (
      window.location.pathname !== "/game" &&
      window.location.pathname !== "/"
    ) {
      navigate(`/games?searchTerm=${searchTerm}`); // Sửa lại đường dẫn tới trang game list
    }
  };

  // Xử lý khi click vào một gợi ý (giữ nguyên)
  const handleSuggestionClick = () => {
    setSearchTerm("");
    setSuggestions([]);
  };

  return (
    <form className="search-bar-form" onSubmit={handleSubmit} ref={searchRef}>
      {/* Input và Button tìm kiếm giữ nguyên */}
      <input
        type="text"
        className="search-input"
        placeholder="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoComplete="off"
      />
      <button type="submit" className="search-button" aria-label="Search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </button>

      {/* === CẬP NHẬT CẤU TRÚC DANH SÁCH GỢI Ý === */}
      {searchTerm && (
        <div className="suggestions-dropdown">
          {loading && (
            <div className="suggestion-item loading">Searching...</div>
          )}
          {!loading &&
            suggestions.length > 0 &&
            suggestions.map((game) => (
              <Link
                to={`/game/${game.id}`}
                key={game.id}
                className="suggestion-item"
                onClick={handleSuggestionClick}
              >
                <div className="media-with-caption">
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="suggestion-image"
                  />
                </div>
                <div className="suggestion-text-content">
                  <div className="suggestion-title">{game.title}</div>
                  <div className="suggestion-price">${game.originalPrice}</div>
                </div>
              </Link>
            ))}
          {!loading && suggestions.length === 0 && (
            <div className="suggestion-item no-results">No results found</div>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
