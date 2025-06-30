import React, { useState, useEffect, useCallback } from "react";
import FilterSidebar from "../FilterSidebar/FilterSidebar";
import GameList from "../GameList/GameList";
import Pagination from "../Pagination/Pagination";
import SearchResultsHeader from "../SearchResultHeader/SearchResultHeader";
import "./GamesPage.css";
import axios from "axios";

const GAMES_PER_PAGE = 5; // Bạn có thể thay đổi số lượng game mỗi trang

const GamesPage = () => {
  // === KHAI BÁO STATE ===
  const [games, setGames] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allPublishers, setAllPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  const [filters, setFilters] = useState({
    searchTerm: "",
    maxPrice: 60,
    selectedTagIds: new Set(),
    selectedPublisherIds: new Set(),
    sort: "name,asc",
  });

  // --- LOGIC GỌI API ---

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [tagsResponse, publishersResponse] = await Promise.all([
          axios.get("http://localhost:8080/tags"),
          axios.get("http://localhost:8080/publisher/list"),
        ]);
        if (tagsResponse.data)
          setAllTags(
            tagsResponse.data.sort((a, b) => a.tagName.localeCompare(b.tagName))
          );
        if (publishersResponse.data)
          setAllPublishers(
            publishersResponse.data.sort((a, b) =>
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
    console.log("Gia", filters.maxPrice);
    if (filters.selectedTagIds.size > 0)
      params.append("tags", Array.from(filters.selectedTagIds).join(","));
    if (filters.selectedPublisherIds.size > 0)
      params.append(
        "publishers",
        Array.from(filters.selectedPublisherIds).join(",")
      );

    const [sortField, sortDir] = filters.sort.split(",");
    params.append("sort", sortField);
    params.append("dir", sortDir);
    params.append("page", currentPage);
    params.append("size", GAMES_PER_PAGE);

    const apiUrl = `http://localhost:8080/game?${params.toString()}`;
    console.log("Fetching games from:", apiUrl);

    try {
      const response = await axios.get(apiUrl);
      const pageData = response.data;
      setGames(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setTotalGames(pageData.totalElements || 0);
    } catch (e) {
      console.error("Failed to fetch games:", e);
      setError(e.message);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]); // Phụ thuộc vào `filters` và `currentPage`

  // 3. useEffect để trigger việc gọi API
  useEffect(() => {
    fetchGames();
  }, [fetchGames]); // Chỉ phụ thuộc vào hàm fetchGames đã được useCallback tối ưu

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN (Tối ưu với useCallback) ---

  const handleFilterChange = useCallback((filterType, value) => {
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
    setCurrentPage(0); // Luôn reset về trang đầu khi có bộ lọc mới
  }, []);

  const handleSearchSubmit = useCallback((term) => {
    setFilters((prevFilters) => ({ ...prevFilters, searchTerm: term }));
    setCurrentPage(0);
  }, []);

  // --- RENDER ---
  return (
    <div className="games-page-container mt-5">
      <div className="page-main-content">
        <div className="game-content-wrapper">
          <SearchResultsHeader
            resultCount={totalGames}
            searchTerm={filters.searchTerm}
            currentSort={filters.sort}
            onSortChange={handleFilterChange}
            handleSearchSubmit={handleSearchSubmit}
          />
          <GameList games={games} loading={loading} error={error} />
          <Pagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
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
