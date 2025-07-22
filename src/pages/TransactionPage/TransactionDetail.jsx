import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TransactionDetail.css";
import { useTranslation } from "react-i18next";



const TransactionDetail = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const {t} = useTranslation();

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/transaction/detail/${transactionId}`);
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
    return <div className="transaction-detail-loading">{t('Loading transaction detail...')}</div>;
  }

  if (!transaction) {
    return <div className="transaction-detail-error">{t('Transaction not found.')}</div>;
  }

  return (
    <div className="transaction-detail-container">
      <div className="transaction-detail-header">
        <h2 className="transaction-detail-title">
          {t(`'s Transaction Detail`, {userName: username})}
        </h2>
        <button
          className="back-button"
          onClick={() => navigate("/account/history")}
        >
          ⬅ {t('Back to Transaction History')}
        </button>
      </div>

      <div className="transaction-detail-box">
        <p><strong>{t('Transaction ID')}:</strong> {transaction.transactionId}</p>
        <p><strong>{t('Owner')}:</strong> {transaction.Owner}</p>
        <p><strong>{t('Game ID')}:</strong> {transaction.gameId}</p>
        <p><strong>{t('Game Name')}:</strong> {transaction.gameName}</p>
        <p><strong>{t('Price')}:</strong> {transaction.price == 0? t("Free") :$transaction.price.toFixed(2)}</p>
        <p><strong>{t('Date')}:</strong> {transaction.dateCreated}</p>
      </div>

      <div className="transaction-issue-section">
        <h3 className="issue-title">{t('What issue are you having with this purchase?')}</h3>
        <div className="issue-options">
          <div className="issue-option">
            {t('I would like a refund')}
            <span className="issue-arrow">▶</span>
          </div>
          <div className="issue-option">
            {t('I was charged the wrong amount')}
            <span className="issue-arrow">▶</span>
          </div>
          <div className="issue-option">
            {t('I have a question about this purchase')}
            <span className="issue-arrow">▶</span>
          </div>
          <div className="issue-option">
            {t('I would like to view or print the receipt for this purchase')}
            <span className="issue-arrow">▶</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
