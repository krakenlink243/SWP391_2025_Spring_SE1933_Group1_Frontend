import React from "react";
import "./Pagination.css"; // Sẽ tạo file CSS này sau

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Không hiển thị phân trang nếu chỉ có 1 trang hoặc ít hơn
  }

  const handlePrev = () => {
    // currentPage đang là 1-based, state là 0-based
    onPageChange(currentPage - 1 - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage - 1 + 1);
  };

  return (
    <div className="pagination">
      <button onClick={handlePrev} disabled={currentPage === 1}>
        &laquo; Prev
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;
