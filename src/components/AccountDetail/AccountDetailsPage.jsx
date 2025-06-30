import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountDetailsPage.css";

const AccountDetailsPage = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(50000); // Số tiền nạp mặc định
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/user/profile/${localStorage.getItem("userId")}`
      )
      .then((res) => setAccount(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddFunds = async () => {
    if (amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (amount < 5) {
      alert("Minimum ammount is 5$");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/payments/create-vnpay-payment?amount=${amount}`
      );
      const { paymentUrl } = response.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
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
          {/* ... */}
        </aside>

        <main className="account-info-panel">
          <h1>{account?.username}'s Account</h1>

          <section className="info-section purchase-history">
            <h3>STORE & PURCHASE HISTORY</h3>
            <div className="wallet-balance">
              <span>Wallet Balance</span>
              <strong>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "USD",
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
            {/* ... các thông tin khác ... */}
          </section>
        </main>
      </div>

      {/* Modal để nạp tiền */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Funds to Wallet</h2>
            <div className="amount-options">
              <button onClick={() => setAmount(50)}>50$</button>
              <button onClick={() => setAmount(100)}>100$</button>
              <button onClick={() => setAmount(200)}>200$</button>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Or enter an amount"
            />
            <div className="modal-actions">
              <button onClick={handleAddFunds} className="action-btn primary">
                Continue to VNPay
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
