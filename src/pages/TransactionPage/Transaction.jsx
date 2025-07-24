import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Transaction.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

/**
 * @author BaThanh
 * @description Component for showing transaction
 * @param {*} param0
 * @returns
 */
const username = localStorage.getItem("username");

const Transaction = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuth();
  if (!token) {
    navigate("/");
  }

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

   const types = [
     { type: "Add", description: t("Receive") },
     { type: "Subtract", description: t("Purchase") },
     { type: "Refund Add", description: t("Refund Add") },
     { type: "Refund Subtract", description: t("Refund Subtract") },
   ];

  // Fetch and sort transaction history from backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/transaction`
      );
      console.log("Transactions API response:", response.data);
      let transactions = response.data.data || [];

      // Sort transactions by transactionId in descending order (highest ID first)
      transactions = transactions.sort((a, b) => {
        const idA = a.transactionId || 0;
        const idB = b.transactionId || 0;
        return idB - idA; // Descending order: higher transactionId first
      });

      setTransactions(transactions);
    } catch (error) {
      console.error(
        "Error fetching transactions:",
        error.message,
        error.response?.status,
        error.response?.data
      );
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDetailClick = (transactionId) => {
    console.log(`Detail clicked for transaction ID: ${transactionId}`);
    navigate(`/account/history/detail/${transactionId}`);
  };

  return (
    <div className="transaction-steam-bg">
      <div className="transaction-main-steam">
        <h2 className="transaction-title-steam">
          {t(`'s Purchase History`, { userName: username })}
        </h2>
        <div className="transaction-list-steam">
          {loading ? (
            <div className="transaction-loading">{t("Loading...")}</div>
          ) : transactions.length === 0 ? (
            <div className="transaction-empty-steam">
              {t("No transactions found.")}
            </div>
          ) : (
            <div className="transaction-items-container">
              <table className="transaction-table-steam">
                <thead>
                  <tr>
                    <th className="transaction-th-date">{t("Date")}</th>
                    <th className="transaction-th-item">{t("Game")}</th>
                    <th className="transaction-th-type">{t("Type")}</th>
                    <th className="transaction-th-amount">{t("Amount")}</th>
                    <th className="transaction-th-changes">{t("Changes")}</th>
                    <th className="transaction-th-detail">{t("Detail")}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, idx) => {
                    const amount = tx.price ?? tx.amount ?? tx.totalAmount ?? 0;
                    const typeObj = types.find((type) => type.type === tx.type);
                    const typeLabel = typeObj ? typeObj.description : t("Unknown");
                    const changesLabel =
                      amount === 0
                      ? ""
                      : (tx.type === "Add" || tx.type === "Refund Add")
                      ? `+ $${amount.toFixed(2)}`
                      : (tx.type === "Subtract" || tx.type === "Refund Subtract")
                      ? `- $${amount.toFixed(2)}`
                      : "";
                    return (
                      <tr key={idx} className="transaction-row-steam">
                        <td className="transaction-td-date">
                          {(tx.dateCreated || tx.createdAt || tx.date || "")
                            .toString()
                            .slice(0, 10)}
                        </td>
                        <td className="transaction-td-item">
                          {tx.gameName || tx.item || t("Unknown Item")}
                        </td>
                        <td className="transaction-td-type">{typeLabel}</td>
                        <td className="transaction-td-amount">
                          {amount === 0 ? t("Free") : `$${amount.toFixed(2)}`}
                        </td>
                        <td
                          className={`transaction-td-changes ${
                            tx.type === "Add"
                              ? "transaction-green"
                              : tx.type === "Subtract" || tx.type === "Buy"
                              ? "transaction-red"
                              : ""
                          }`}
                        >
                          {changesLabel}
                        </td>
                        <td
                          className="transaction-td-detail"
                          onClick={() => handleDetailClick(tx.transactionId)}
                        >
                          {t("Detail")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
