import React from "react";
import GameList from "../GameList/GameList";
import FilterSidebar from "../FilterSidebar/FilterSidebar";
import "./MainContent.css"; // CSS cho MainContent  

const MainContent = () => {
  return (
    <div className="main-content-area-wrapper">
      <GameList />
      <FilterSidebar />
    </div>
  );
};

export default MainContent;
