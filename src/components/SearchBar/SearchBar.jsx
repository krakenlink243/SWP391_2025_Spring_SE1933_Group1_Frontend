import React, { useState } from "react";
import "./SearchBar.css";

// SearchBar giờ nhận một prop là hàm onSearchSubmit từ component cha
const SearchBar = ({ onSearchSubmit }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang khi submit form
    onSearchSubmit(searchTerm); // Gọi hàm của cha và truyền vào từ khóa tìm kiếm
  };

  return (
    // Bọc input và button trong một form để có thể submit bằng phím Enter
    <form className="search-bar-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Search games..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button type="submit" className="search-button">
        {/* Icon kính lúp (SVG) */}
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
    </form>
  );
};

export default SearchBar;
