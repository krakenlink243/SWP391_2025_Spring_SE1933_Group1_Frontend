import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TransactionDetail.css";

const TransactionDetail = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/user/transaction/detail/${transactionId}`);
        if (res.data.success) {
          setTransaction(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching transaction detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [transactionId]);

  if (loading) {
    return <div className="transaction-detail-loading">Loading transaction detail...</div>;
  }

  if (!transaction) {
    return <div className="transaction-detail-error">Transaction not found.</div>;
  }

  return (
    <div className="transaction-detail-container">
      <div className="transaction-detail-header">
        <h2 className="transaction-detail-title">
          {username ? `${username}'s Transaction Detail` : "Transaction Detail"}
        </h2>
        <button
          className="back-button"
          onClick={() => navigate("/transaction")}
        >
          ⬅ Back to Transaction History
        </button>
      </div>

      <div className="transaction-detail-box">
        <p><strong>Transaction ID:</strong> {transaction.transactionId}</p>
        <p><strong>Owner:</strong> {transaction.Owner}</p>
        <p><strong>Game ID:</strong> {transaction.gameId}</p>
        <p><strong>Game Name:</strong> {transaction.gameName}</p>
        <p><strong>Price:</strong> ${transaction.price?.toFixed(2)}</p>
        <p><strong>Date:</strong> {transaction.dateCreated}</p>
      </div>

      <div className="transaction-issue-section">
        <h3 className="issue-title">What issue are you having with this purchase?</h3>
        <div className="issue-options">
          <div className="issue-option">
            I would like a refund
            <span className="issue-arrow">▶</span>
          </div>
          <div className="issue-option">
            I was charged the wrong amount
            <span className="issue-arrow">▶</span>
          </div>
          <div className="issue-option">
            I have a question about this purchase
            <span className="issue-arrow">▶</span>
          </div>
          <div className="issue-option">
            I would like to view or print the receipt for this purchase
            <span className="issue-arrow">▶</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
