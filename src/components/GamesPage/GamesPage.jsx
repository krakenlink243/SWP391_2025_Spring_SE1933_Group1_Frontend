import React, { useState, useEffect, useCallback } from "react";
import FilterSidebar from "../FilterSidebar/FilterSidebar";
import GameList from "../GameList/GameList"; // Dùng lại GameList đã sửa ở bước trước
import "./GamesPage.css";
//phan trang nha bro
const gamesPerPage = 5;

const GamesPage = () => {
  // === State gốc ===
  const [games, setGames] = useState([]); // Giờ đây sẽ là game đã được lọc từ API
  const [allTags, setAllTags] = useState([]);
  const [allPublishers, setAllPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === State cho các bộ lọc ===
  const [filters, setFilters] = useState({
    maxPrice: 60,
    selectedTagIds: new Set(),
    selectedPublisherIds: new Set(),
  });

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [tagsResponse, publishersResponse] = await Promise.all([
          fetch("http://localhost:8080/tags"),
          fetch("http://localhost:8080/publisher/list"), // Giả sử bạn có API này
        ]);

        const tagsData = await tagsResponse.json();
        const publishersData = await publishersResponse.json();

        if (tagsData) {
          tagsData.sort((a, b) => a.tagName.localeCompare(b.tagName));
          setAllTags(tagsData);
        }
        if (publishersData) {
          publishersData.sort((a, b) =>
            a.publisherName.localeCompare(b.publisherName)
          );
          setAllPublishers(publishersData);
        }
      } catch (e) {
        console.error("Failed to fetch filter data", e);
        // Có thể set một lỗi riêng cho việc tải bộ lọc
      }
    };

    fetchFilterData();
  }, []);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Xây dựng query string từ state `filters`
    const params = new URLSearchParams();
    if (filters.maxPrice < 60) {
      // Giả sử 60 là giá trị "Any"
      params.append("maxPrice", filters.maxPrice);
    }
    if (filters.selectedTagIds.size > 0) {
      params.append("tags", Array.from(filters.selectedTagIds).join(","));
    }
    if (filters.selectedPublisherIds.size > 0) {
      params.append(
        "publishers",
        Array.from(filters.selectedPublisherIds).join(",")
      );
    }

    const queryString = params.toString();
    const apiUrl = `http://localhost:8080/game${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("Fetching games from:", apiUrl); // Log ra để debug

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const gamesData = await response.json();
      setGames(gamesData || []);
    } catch (e) {
      console.error("Failed to fetch games:", e);
      setError(e.message);
      setGames([]); // Xóa game cũ nếu có lỗi
    } finally {
      setLoading(false);
    }
  }, [filters]); // Phụ thuộc vào object filters

  // Gọi fetchGames khi `filters` thay đổi
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // 3. Hàm xử lý chung cho việc thay đổi bộ lọc, được truyền xuống Sidebar
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (filterType === "price") {
        newFilters.maxPrice = value;
      } else if (filterType === "tag") {
        const newTagIds = new Set(prevFilters.selectedTagIds);
        if (newTagIds.has(value)) {
          newTagIds.delete(value);
        } else {
          newTagIds.add(value);
        }
        newFilters.selectedTagIds = newTagIds;
      } else if (filterType === "publisher") {
        const newPublisherIds = new Set(prevFilters.selectedPublisherIds);
        if (newPublisherIds.has(value)) {
          newPublisherIds.delete(value);
        } else {
          newPublisherIds.add(value);
        }
        newFilters.selectedPublisherIds = newPublisherIds;
      }

      return newFilters;
    });
  };

  // Phân trang nha bro
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(games.length / gamesPerPage);
  useEffect(() => {
    setCurrentPage(1); // Reset trang về 1 khi lọc thay đổi
    fetchGames();
  }, [fetchGames]);

  return (
    <div className="games-page-container">
      <div className="content-wrapper">
        <main className="game-list-content">
          <GameList games={currentGames} loading={loading} error={error} />
        </main>
        <aside className="filter-sidebar">
          <FilterSidebar
            allTags={allTags}
            allPublishers={allPublishers}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GamesPage;
