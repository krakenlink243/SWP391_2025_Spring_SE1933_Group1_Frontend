import React, { useState, useEffect, useMemo } from "react";
import "./FilterSidebar.css";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({ allTags, allPublishers, filters, onFilterChange }) => {
  const {t}=useTranslation();
  const [localPrice, setLocalPrice] = useState(filters.maxPrice);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [publisherSearchTerm, setPublisherSearchTerm] = useState("");
  useEffect(() => {
      onFilterChange("maxPrice", localPrice);
  }, [localPrice, filters.maxPrice, onFilterChange]);

  const displayedTags = useMemo(() => {
    const selected = filters.selectedTagIds;
    const selectedItems = allTags.filter((tag) => selected.has(tag.tagId));
    const remainingItems = allTags.filter(
      (tag) =>
        !selected.has(tag.tagId) &&
        tag.tagName.toLowerCase().includes(tagSearchTerm.toLowerCase())
    );
    return [
      ...selectedItems,
      ...(tagSearchTerm ? remainingItems : remainingItems.slice(0, 10)),
    ];
  }, [allTags, filters.selectedTagIds, tagSearchTerm]);

  const displayedPublishers = useMemo(() => {
    const selected = filters.selectedPublisherIds;
    const selectedItems = allPublishers.filter((p) =>
      selected.has(p.publisherId)
    );
    const remainingItems = allPublishers.filter(
      (p) =>
        !selected.has(p.publisherId) &&
        p.publisherName
          .toLowerCase()
          .includes(publisherSearchTerm.toLowerCase())
    );
    return [
      ...selectedItems,
      ...(publisherSearchTerm ? remainingItems : remainingItems.slice(0, 10)),
    ];
  }, [allPublishers, filters.selectedPublisherIds, publisherSearchTerm]);

  return (
    <aside className="filter-sidebar-container">
      <h4>{t('Narrow by Price')}</h4>
      <div className="filter-group price-filter">
        <input
          type="range"
          id="price-range"
          min="0"
          max="60"
          value={localPrice}
          onChange={(e) => {
            setLocalPrice(parseInt(e.target.value));
          }}
        />
        <span className="price-label">
          {localPrice >= 60 ? t("Any Price") : t(`Under $`, {price: localPrice})}
        </span>
      </div>

      <h4>{t('Narrow by Tag')}</h4>
      <div className="filter-group">
        <input
          type="search"
          className="filter-search"
          placeholder={t("Search for tags")}
          value={tagSearchTerm}
          onChange={(e) => setTagSearchTerm(e.target.value)}
        />
        <div className="checkbox-list">
          {displayedTags.map((tag) => (
            <label key={tag.tagId} className="filter-item">
              <input
                type="checkbox"
                checked={filters.selectedTagIds.has(tag.tagId)}
                onChange={() => onFilterChange("tag", tag.tagId)}
              />
              {tag.tagName}
            </label>
          ))}
        </div>
      </div>

      <h4>{t('Narrow by Publisher')}</h4>
      <div className="filter-group">
        <input
          type="search"
          className="filter-search"
          placeholder={t("Search for publishers")}
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
                onChange={() =>
                  onFilterChange("publisher", publisher.publisherId)
                }
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
