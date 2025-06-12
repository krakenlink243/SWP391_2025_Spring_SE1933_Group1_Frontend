// src/App.jsx
import React from "react";
import Header from "./components/Header/header"; // Header chính (full-width)
import Navbar from "./components/Navbar/Navbar"; // Navbar phụ
import MainContent from "./components/MainContent/MainContent"; // Khu vực GameList và FilterSidebar
import "./App.css"; // Đảm bảo bạn import App.css

function App() {
  return (
    <div className="app-container">
      {" "}
      {/* Container chính của toàn bộ ứng dụng */}
      <Header /> {/* Header này sẽ vẫn full-width */}
      <div className="page-content-constrained-wrapper">
        <Navbar />
        {/* Bạn có thể thêm các thành phần khác vào đây nếu cần,
            ví dụ: tiêu đề trang "Tất cả sản phẩm", các bộ lọc chung */}
        <MainContent />
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
