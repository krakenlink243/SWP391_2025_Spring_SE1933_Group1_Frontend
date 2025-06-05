import React from "react";
import "./FilterSidebar.css"; // CSS cho FilterSidebar

const FilterSidebar = () => {
  return (
    <aside className="filter-sidebar-container">
      <h4>Narrow by Price</h4>
      {/* Input range hoặc các option giá ở đây */}
      <div className="filter-group">
        <label htmlFor="price-any">Any Price</label>
        <input type="radio" name="price" id="price-any" defaultChecked />
      </div>
      {/* ... các mức giá khác ... */}

      <h4>Narrow by tag</h4>
      <div className="filter-group">
        <label>
          <input type="checkbox" /> Action
        </label>
        <label>
          <input type="checkbox" /> Adventure
        </label>
        <label>
          <input type="checkbox" /> RPG
        </label>
        <label>
          <input type="checkbox" /> Singleplayer
        </label>
        {/* ... các tags khác ... */}
        <a href="#" className="show-more-tags">
          search for more tags
        </a>
      </div>

      <h4>Narrow by OS</h4>
      <label>
        <input type="checkbox" /> Windows
      </label>
      <label>
        <input type="checkbox" /> macOS
      </label>
      <label>
        <input type="checkbox" /> SteamOS + Linux
      </label>

      {/* Thêm các bộ lọc khác nếu cần */}
    </aside>
  );
};

export default FilterSidebar;
