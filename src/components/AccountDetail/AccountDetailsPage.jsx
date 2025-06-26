import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountDetailsPage.css";

const AccountDetailsPage = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === STATE CHO MODAL NẠP TIỀN (BẰNG USD) ===
  const [amountUsd, setAmountUsd] = useState(5); // Số tiền nạp mặc định là $5
  const [bankCode, setBankCode] = useState("");
  const [language, setLanguage] = useState("vn");

  useEffect(() => {
    // Gọi API để lấy thông tin tài khoản
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:8080/user/profile/${userId}`)
        .then((res) => setAccount(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleAddFunds = async () => {
    if (amountUsd < 5) {
      // Giới hạn số tiền nạp tối thiểu là $5
      alert("Minimum funding amount is $5.");
      return;
    }
    try {
      // Xây dựng các tham số cho request
      const params = {
        amount: amountUsd,
        language: language,
      };
      if (bankCode) {
        params.bankCode = bankCode;
      }

      const response = await axios.post(
        `http://localhost:8080/api/v1/payments/create-vnpay-payment`,
        null,
        { params: params }
      );

      const { paymentUrl } = response.data;
      if (paymentUrl) {
        window.location.href = paymentUrl; // Chuyển hướng đến cổng thanh toán
      }
    } catch (error) {
      console.error("Failed to create payment URL:", error);
      alert("Error creating payment link. Please try again.");
    }
  };

  if (loading) return <div>Loading account details...</div>;

  return (
    <div className="account-details-page">
      <div className="account-main-content">
        <aside className="account-sidebar">
          <a href="#" className="active">
            Account details
          </a>
          <a href="#">Store preferences</a>
        </aside>

        <main className="account-info-panel">
          <h1>{account?.username}'s Account</h1>
          <section className="info-section purchase-history">
            <h3>STORE & PURCHASE HISTORY</h3>
            <div className="wallet-balance">
              <span>Wallet Balance</span>
              <strong>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD", // Hiển thị số dư bằng USD
                }).format(account?.walletBalance || 0)}
              </strong>
            </div>
            <div className="action-links">
              <button
                onClick={() => setIsModalOpen(true)}
                className="action-btn"
              >
                Add funds to your Wallet
              </button>
              <a href="#">View purchase history</a>
            </div>
          </section>
          <section className="info-section contact-info">
            <h3>CONTACT INFO</h3>
            <p>Email address: {account?.email}</p>
            <a href="change-email">Manage email preferences</a>
          </section>
        </main>
      </div>

      {/* MODAL NẠP TIỀN (LÀM VIỆC VỚI USD) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Funds to Your Steam Wallet</h2>
            <div className="amount-options">
              <button onClick={() => setAmountUsd(5)}>$5.00</button>
              <button onClick={() => setAmountUsd(10)}>$10.00</button>
              <button onClick={() => setAmountUsd(25)}>$25.00</button>
              <button onClick={() => setAmountUsd(50)}>$50.00</button>
              <button onClick={() => setAmountUsd(100)}>$100.00</button>
            </div>

            <input
              type="number"
              value={amountUsd}
              onChange={(e) => setAmountUsd(e.target.value)}
              placeholder="Or enter an amount (USD)"
              min="5" // Đặt giá trị tối thiểu
            />

            <div className="form-group-modal">
              <label htmlFor="bankCode">Bank (Optional)</label>
              <select
                id="bankCode"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              >
                <option value="">Select a bank...</option>
                <option value="NCB">NCB (Recommended)</option>
                <option value="VNBANK">Ngân hàng Nội địa</option>
                <option value="VnPayQR">VNPAYQR</option>
                <option value="VISA">VISA</option>
              </select>
            </div>

            <div className="form-actions">
              <button onClick={handleAddFunds} className="action-btn primary">
                Add Funds
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="action-btn secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetailsPage;
