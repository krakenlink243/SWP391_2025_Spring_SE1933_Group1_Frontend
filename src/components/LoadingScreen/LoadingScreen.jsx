// src/components/SplashScreen/SplashScreen.jsx
import React from "react";
import "./LoadingScreen.css";

// Component này nhận một prop 'isExiting' để kích hoạt hiệu ứng transition
const LoadingScreen = ({ isExiting }) => {
  return (
    // Thêm class 'exiting' khi bắt đầu transition
    <div className={`loading-screen ${isExiting ? "exiting" : ""}`}>
      <div className="logo-container">
        {/* Logo của bạn */}
        <img
          src="/logo_steam_circle.svg" // Thay bằng đường dẫn logo của bạn trong thư mục /public
          alt="Logo"
          className="loading-logo"
        />
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
