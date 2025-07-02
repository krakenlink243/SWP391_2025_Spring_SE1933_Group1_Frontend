import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./PaymentResultPage.css"; // Sẽ tạo file CSS này

const PaymentResultPage = () => {
  const location = useLocation();
  const [status, setStatus] = useState("processing"); // 'processing', 'success', 'failed'
  const [message, setMessage] = useState(
    "Processing your payment, please wait..."
  );
  const [details, setDetails] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get("vnp_ResponseCode");
    const transactionStatus = params.get("vnp_TransactionStatus");

    // Lấy thông tin chi tiết để hiển thị
    setDetails({
      amount: params.get("vnp_Amount"),
      bankCode: params.get("vnp_BankCode"),
      orderInfo: params.get("vnp_OrderInfo"),
      payDate: params.get("vnp_PayDate"),
      transactionNo: params.get("vnp_TransactionNo"),
    });

    if (responseCode === "00") {
      setStatus("success");
      setMessage("Your payment was successful!");

      axios.post(
        `${import.meta.env.VITE_API_URL}/user/wallet/add?amount=${
          params.get("vnp_Amount") / 2450000
        }`
      );
    } else {
      setStatus("failed");
      setMessage("Your payment failed. Please try again or contact support.");
    }
  }, [location]);

  // Định dạng ngày giờ cho dễ đọc
  const formatPayDate = (payDate) => {
    if (!payDate) return "N/A";
    const year = payDate.substring(0, 4);
    const month = payDate.substring(4, 6);
    const day = payDate.substring(6, 8);
    const hour = payDate.substring(8, 10);
    const minute = payDate.substring(10, 12);
    const second = payDate.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  return (
    <div className="payment-result-page">
      <div className={`payment-result-box status-${status}`}>
        <div className="status-icon-wrapper">
          {status === "success" && <div className="status-icon success">✓</div>}
          {status === "failed" && <div className="status-icon error">✗</div>}
          {status === "processing" && <div className="spinner"></div>}
        </div>

        <h1 className="status-title">{message}</h1>
        <p className="status-subtitle">
          Please check your account balance for confirmation.
        </p>

        <div className="transaction-details">
          <h4>Transaction Details</h4>
          <ul>
            <li>
              <strong>Amount:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(details.amount / 100)}
            </li>
            <li>
              <strong>Bank:</strong> {details.bankCode}
            </li>
            <li>
              <strong>Order Info:</strong> {details.orderInfo}
            </li>
            <li>
              <strong>VNPay Transaction No:</strong> {details.transactionNo}
            </li>
            <li>
              <strong>Payment Time:</strong> {formatPayDate(details.payDate)}
            </li>
          </ul>
        </div>

        <Link to="/account" className="action-btn primary">
          Return to Account
        </Link>
      </div>
    </div>
  );
};

export default PaymentResultPage;
