import React, { useState, useMemo } from "react";
import "./FilterSidebar.css";

const FilterSidebar = ({ allTags, allPublishers, filters, onFilterChange }) => {
  // State nội bộ cho các ô tìm kiếm
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [publisherSearchTerm, setPublisherSearchTerm] = useState("");

  const handlePriceChange = (e) => {
    onFilterChange("price", parseInt(e.target.value, 10));
  };

  const handleTagChange = (tagId) => {
    onFilterChange("tag", tagId);
  };

  const handlePublisherChange = (publisherId) => {
    onFilterChange("publisher", publisherId);
  };

  // Logic để quyết định hiển thị tag nào
  const displayedTags = useMemo(() => {
    const selected = new Set(filters.selectedTagIds);

    // Luôn hiển thị các tag đã được chọn
    const selectedItems = allTags.filter((tag) => selected.has(tag.tagId));

    // Lọc các tag còn lại dựa trên ô tìm kiếm
    const filteredItems = allTags.filter(
      (tag) =>
        !selected.has(tag.tagId) &&
        tag.tagName.toLowerCase().includes(tagSearchTerm.toLowerCase())
    );

    // Nếu không có tìm kiếm, chỉ lấy 10 tag đầu tiên trong danh sách đã lọc
    const remainingItems = tagSearchTerm
      ? filteredItems
      : filteredItems.slice(0, 10);

    return [...selectedItems, ...remainingItems];
  }, [allTags, filters.selectedTagIds, tagSearchTerm]);

  // Logic tương tự để hiển thị publisher
  const displayedPublishers = useMemo(() => {
    const selected = new Set(filters.selectedPublisherIds);
    const selectedItems = allPublishers.filter((p) =>
      selected.has(p.publisherId)
    );
    const filteredItems = allPublishers.filter(
      (p) =>
        !selected.has(p.publisherId) &&
        p.publisherName
          .toLowerCase()
          .includes(publisherSearchTerm.toLowerCase())
    );
    const remainingItems = publisherSearchTerm
      ? filteredItems
      : filteredItems.slice(0, 10);

    return [...selectedItems, ...remainingItems];
  }, [allPublishers, filters.selectedPublisherIds, publisherSearchTerm]);

  return (
    <aside className="filter-sidebar-container">
      <h4>Narrow by Price</h4>
      <div className="filter-group price-filter">
        <input
          type="range"
          id="price-range"
          min="0"
          max="60" // 60 được coi là "Any Price"
          value={filters.maxPrice}
          onChange={handlePriceChange}
        />
        <span className="price-label">
          {filters.maxPrice >= 60 ? "Any Price" : `Under $${filters.maxPrice}`}
        </span>
      </div>

      <h4>Narrow by Tag</h4>
      <div className="filter-group">
        <input
          type="search"
          className="filter-search"
          placeholder="search for more tags"
          value={tagSearchTerm}
          onChange={(e) => setTagSearchTerm(e.target.value)}
        />
        <div className="checkbox-list">
          {displayedTags.map((tag) => (
            <label key={tag.tagId} className="filter-item">
              <input
                type="checkbox"
                checked={filters.selectedTagIds.has(tag.tagId)}
                onChange={() => handleTagChange(tag.tagId)}
              />
              {tag.tagName}
            </label>
          ))}
        </div>
      </div>

      <h4>Narrow by Publisher</h4>
      <div className="filter-group">
        <input
          type="search"
          className="filter-search"
          placeholder="search for more publishers"
          value={publisherSearchTerm}
          onChange={(e) => setPublisherSearchTerm(e.target.value)}
        />
        <div className="checkbox-list">
          {displayedPublishers.map((publisher) => (
            <label key={publisher.publisherId} className="filter-item">
              <input
                type="checkbox"
                checked={filters.selectedPublisherIds.has(
                  publisher.publisherId
                )}
                onChange={() => handlePublisherChange(publisher.publisherId)}
              />
              {publisher.publisherName}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
