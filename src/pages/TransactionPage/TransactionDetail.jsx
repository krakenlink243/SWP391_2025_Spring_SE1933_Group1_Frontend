import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TransactionDetail.css";
import { useTranslation } from "react-i18next";

const TransactionDetail = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [trans, setTrans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefundEligible, setIsRefundEligible] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const { t } = useTranslation();

  const types = [
    { type: "Add", description: t("Receive") },
    { type: "Subtract", description: t("Purchase") },
    { type: "Refund Add", description: t("Refund Add") },
    { type: "Refund Subtract", description: t("Refund Subtract") }
  ];

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/user/transaction/detail/${transactionId}`
        );
        if (res.data.success) {
          setTransaction(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching transaction detail:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTransaction = async () => {
      try {
        const response = await axios.get(
          `swp3912025springse1933group1backend-productionnewgen.up.railway.app/user/transaction`
        );
        if (response.data.success) {
          // Find the transaction with the matching transactionId
          const found = response.data.data.find(
            (item) => String(item.transactionId) === String(transactionId)
          );
          setTrans(found || null);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactionDetail();
    fetchTransaction();
  }, [transactionId]);
  const checkRefundEligibility = async () => {
    if (!transaction || !transaction.dateCreated) return;

    try {
      const res = await axios.get(
        `swp3912025springse1933group1backend-productionnewgen.up.railway.app/user/library/${userId}/${
          transaction.gameId
        }`
      );
      const playtime = res.data.playtimeInMillis;
      console.log(`Playtime for game ${transaction.gameId}: ${playtime} ms`);

      const transactionDate = new Date(transaction.dateCreated);
      const now = new Date();
      const diffInMs = now - transactionDate;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (playtime > 2 * 60 * 60 * 1000) {
        setIsRefundEligible(false);
        setRefundReason("Playtime exceeds 2 hours");
      } else if (diffInDays > 7) {
        setIsRefundEligible(false);
        setRefundReason("Transaction is older than 7 days");
      } else {
        setIsRefundEligible(true);
        setRefundReason("");
      }
    } catch (err) {
      console.error("Error checking refund eligibility:", err);
      setIsRefundEligible(false);
      setRefundReason("Failed to check refund eligibility");
    }
  };
  const handleRefundClick = async () => {
    await checkRefundEligibility();
  };
  useEffect(() => {
    if (isRefundEligible === true) {
      const confirmed = window.confirm(
        "You are eligible for a refund. Do you want to proceed?"
      );
      if (confirmed) {
        callRefundApi();
      }
    } else if (isRefundEligible === false) {
      alert(
        `Refund not allowed.\nReason: ${refundReason}\nTransaction ID: ${transaction.transactionId}\nTotal Amount: ${transaction.price}\nDate Created: ${transaction.dateCreated}`
      );
    }
  }, [isRefundEligible]);
  const callRefundApi = async () => {
    try {
      const res = await axios.post(
        `swp3912025springse1933group1backend-productionnewgen.up.railway.app/user/transaction/refund/${
          transaction.transactionId
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        alert("Refund successful!");
        navigate("/account/history");
      } else {
        alert("Refund failed: " + res.data.message);
      }
    } catch (err) {
      console.error("Error calling refund API:", err);
      alert("Refund failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="transaction-detail-loading">
        {t("Loading transaction detail...")}
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="transaction-detail-error">
        {t("Transaction not found.")}
      </div>
    );
  }

  // Only show the issue section if trans exists and trans.type is not "Add"
  return (
    <div className="transaction-detail-container">
      <div className="transaction-detail-header">
        <h2 className="transaction-detail-title">
          {t(`'s Transaction Detail`, { userName: username })}
        </h2>
        <button
          className="back-button"
          onClick={() => navigate("/account/history")}
        >
          ⬅ {t("Back to Transaction History")}
        </button>
      </div>

      <div className="transaction-detail-box">
        <p>
          <strong>{t("Transaction ID")}:</strong> {transaction.transactionId}
        </p>
        <p>
          <strong>{t("Owner")}:</strong> {transaction.Owner}
        </p>
        <p>
          <strong>{t("Game ID")}:</strong> {transaction.gameId}
        </p>
        <p>
          <strong>{t("Game Name")}:</strong> {transaction.gameName}
        </p>
        <p>
          <strong>{t("Type")}:</strong>{" "}
          {types.find((item) => item.type === (trans?.type || transaction.type))?.description || (trans?.type || transaction.type)}
        </p>
        <p>
          <strong>{t("Price")}:</strong>{" "}
          {transaction.price == 0 ? t("Free") : transaction.price.toFixed(2)}
        </p>
        <p>
          <strong>{t("Date")}:</strong> {transaction.dateCreated}
        </p>
      </div>

      {trans && trans.type === "Add" ? (
        <div className="transaction-issue-section">
          <h3 className="issue-title">{t("Cash Out")}</h3>
          <div className="issue-options">
            <div className="issue-option">
              {t("I would like to withdraw this transaction")}
              <span className="issue-arrow">▶</span>
            </div>
          </div>
        </div>
      ) : (
        (!trans || trans.type !== "Add") && (
          <div className="transaction-issue-section">
            <h3 className="issue-title">
              {t("What issue are you having with this purchase?")}
            </h3>
            <div className="issue-options">
              <div className="issue-option" onClick={handleRefundClick}>
                {t("I would like a refund")}
                <span className="issue-arrow">▶</span>
              </div>
              <div className="issue-option">
                {t("I have a question about this purchase")}
                <span className="issue-arrow">▶</span>
              </div>
              <div className="issue-option">
                {t(
                  "I would like to view or print the receipt for this purchase"
                )}
                <span className="issue-arrow">▶</span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TransactionDetail;
