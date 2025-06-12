import React, { useState, useEffect, useCallback } from "react";
import FilterSidebar from "../FilterSidebar/FilterSidebar";
import GameList from "../GameList/GameList";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";
import SearchResultsHeader from "../SearchResultHeader/SearchResultHeader";
import "./GamesPage.css";

const GAMES_PER_PAGE = 5;

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allPublishers, setAllPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === State cho các bộ lọc, tìm kiếm, sắp xếp ===
  const [filters, setFilters] = useState({
    searchTerm: "",
    maxPrice: 60,
    selectedTagIds: new Set(),
    selectedPublisherIds: new Set(),
    sort: "name,asc", // Giá trị mặc định: sắp xếp theo tên A-Z
  });

  // === State cho phân trang và tổng số kết quả ===
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalGames, setTotalGames] = useState(0); // <-- State mới để lưu tổng số game

  // 1. Fetch dữ liệu cho Sidebar (chỉ chạy 1 lần)
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [tagsResponse, publishersResponse] = await Promise.all([
          fetch("http://localhost:8080/tags"),
          fetch("http://localhost:8080/publisher/list"),
        ]);
        const tagsData = await tagsResponse.json();
        const publishersData = await publishersResponse.json();
        if (tagsData)
          setAllTags(
            tagsData.sort((a, b) => a.tagName.localeCompare(b.tagName))
          );
        if (publishersData)
          setAllPublishers(
            publishersData.sort((a, b) =>
              a.publisherName.localeCompare(b.publisherName)
            )
          );
      } catch (e) {
        console.error("Failed to fetch filter data", e);
      }
    };
    fetchFilterData();
  }, []);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
    if (filters.maxPrice < 60) params.append("maxPrice", filters.maxPrice);
    if (filters.selectedTagIds.size > 0)
      params.append("tags", Array.from(filters.selectedTagIds).join(","));
    if (filters.selectedPublisherIds.size > 0)
      params.append(
        "publishers",
        Array.from(filters.selectedPublisherIds).join(",")
      );

    // Thêm tham số sắp xếp
    const [sortField, sortDir] = filters.sort.split(",");
    params.append("sort", sortField);
    params.append("dir", sortDir);

    params.append("page", currentPage);
    params.append("size", GAMES_PER_PAGE);

    const apiUrl = `http://localhost:8080/game?${params.toString()}`;
    console.log("Fetching games from:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const pageData = await response.json();
      setGames(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setTotalGames(pageData.totalElements || 0); // <-- Cập nhật tổng số game
    } catch (e) {
      console.error("Failed to fetch games:", e);
      setError(e.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Hàm xử lý chung cho việc thay đổi bộ lọc và sắp xếp
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (filterType === "price" || filterType === "sort") {
        newFilters[filterType] = value;
      } else if (filterType === "tag") {
        const newTagIds = new Set(prevFilters.selectedTagIds);
        newTagIds.has(value) ? newTagIds.delete(value) : newTagIds.add(value);
        newFilters.selectedTagIds = newTagIds;
      } else if (filterType === "publisher") {
        const newPublisherIds = new Set(prevFilters.selectedPublisherIds);
        newPublisherIds.has(value)
          ? newPublisherIds.delete(value)
          : newPublisherIds.add(value);
        newFilters.selectedPublisherIds = newPublisherIds;
      }
      return newFilters;
    });
    setCurrentPage(0);
  };

  const handleSearchSubmit = (term) => {
    setFilters((prevFilters) => ({ ...prevFilters, searchTerm: term }));
    setCurrentPage(0);
  };

  return (
    <div className="games-page-container">
      <div className="page-main-content">
        <main className="game-content-wrapper">
          <div className="top-search-bar">
            <SearchBar onSearchSubmit={handleSearchSubmit} />
          </div>
          <SearchResultsHeader
            resultCount={totalGames}
            searchTerm={filters.searchTerm}
            currentSort={filters.sort}
            onSortChange={handleFilterChange}
          />

          <GameList games={games} loading={loading} error={error} />

          <Pagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
        <aside className="filter-sidebar-wrapper">
          <FilterSidebar
            allTags={allTags}
            allPublishers={allPublishers}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>
      </div>
    </div>
  );
};

export default GamesPage;
