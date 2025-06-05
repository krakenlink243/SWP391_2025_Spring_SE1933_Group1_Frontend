import React, { useState, useEffect } from "react";
import GameCard from "../GameCard/GameCard";
import "./GameList.css"; // Đảm bảo bạn có file CSS này hoặc tạo mới

// Nếu bạn dùng axios, uncomment dòng dưới:
import axios from "axios";

const GameList = () => {
  const [games, setGames] = useState([]); // State để lưu danh sách game
  const [loading, setLoading] = useState(true); // State cho trạng thái tải
  const [error, setError] = useState(null); // State cho lỗi (nếu có)

  useEffect(() => {
    // Định nghĩa hàm gọi API
    const fetchGames = async () => {
      try {
        setLoading(true); // Bắt đầu tải
        setError(null); // Reset lỗi cũ

        // --- Sử dụng fetch (mặc định) ---
        // const response = await fetch("localhost:8080/game"); // Thêm http://
        // if (!response.ok) {
        //   // Nếu response không ok (vd: 404, 500), throw lỗi
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json(); // Parse dữ liệu JSON
        // setGames(data); // Cập nhật state với dữ liệu game

        // --- Hoặc sử dụng axios (nếu đã cài đặt và import) ---
        const response = await axios.get("http://localhost:8080/game");
        setGames(response.data);
      } catch (e) {
        // Nếu có lỗi trong quá trình gọi API hoặc xử lý dữ liệu
        console.error("Failed to fetch games:", e);
        setError(e.message); // Lưu thông báo lỗi
      } finally {
        // Dù thành công hay thất bại, kết thúc trạng thái tải
        setLoading(false);
      }
    };

    fetchGames(); // Gọi hàm fetchGames khi component được mount
  }, []); // Mảng rỗng [] đảm bảo useEffect chỉ chạy một lần sau khi component mount

  // Hiển thị thông báo đang tải
  if (loading) {
    return <div className="loading-message">Loading games...</div>;
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="error-message">
        Error fetching games: {error}. Please make sure your backend is running
        and accessible.
      </div>
    );
  }

  // Hiển thị thông báo nếu không có game nào
  if (games.length === 0) {
    return <div className="no-games-message">No games found.</div>;
  }

  // Hiển thị danh sách game
  return (
    <div className="game-list-container">
      {games.map((game) => (
        // Đảm bảo backend trả về 'id' cho mỗi game, hoặc một unique key khác
        // Và các trường dữ liệu mà GameCard mong đợi (title, imageUrl, price, ...)
        <GameCard key={game.id || game._id} game={game} />
      ))}
    </div>
  );
};

export default GameList;
