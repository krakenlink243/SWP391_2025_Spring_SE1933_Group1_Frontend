import React from "react";
import "./SearchResultHeader.css";
import SearchBar from "../SearchBar/SearchBar";


const SearchResultsHeader = ({
  resultCount,
  searchTerm,
  currentSort,
  onSortChange,
  handleSearchSubmit
}) => {
  const handleSortChange = (e) => {
    onSortChange("sort", e.target.value);
  };

  return (
    <div className="search-results-header d-flex flex-column w-100">
      <div className="top-search-wrapper w-100 d-flex flex-row justify-content-between">
        <div className="top-search-bar w-50">
          <SearchBar onSearchSubmit={handleSearchSubmit} />
        </div>

        <div className="sort-options">
          <label htmlFor="sort-by">Sort by</label>
          <select id="sort-by" value={currentSort} onChange={handleSortChange}>
            {/* value phải khớp với tên thuộc tính trong DTO/Entity */}
            <option value="name,asc">Name (A-Z)</option>
            <option value="name,desc">Name (Z-A)</option>
            <option value="releaseDate,desc">Release Date (Newest)</option>
            <option value="releaseDate,asc">Release Date (Oldest)</option>
            <option value="price,asc">Price (Low to High)</option>
            <option value="price,desc">Price (High to Low)</option>
          </select>
        </div>
      </div>
      <div className="results-count w-100">
        {searchTerm ? <h3>Results for "{searchTerm}"</h3> : <h3>All Games</h3>}
        <p>{resultCount} titles found.</p>
      </div>
    </div>
  );
};

export default SearchResultsHeader;
