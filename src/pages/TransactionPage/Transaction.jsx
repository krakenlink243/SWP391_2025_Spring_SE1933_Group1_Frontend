import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import './Transaction.css';

/**
 * @author BaThanh
 * @description Component for showing transaction
 * @param {*} param0 
 * @returns 
 */
const token = localStorage.getItem("token");
let userName = "";
if (token) {
  try {
    const decoded = jwt_decode(token);
    userName = decoded.sub || decoded.username || "";
  } catch (e) {
    userName = "";
  }
}

const Transaction = () => {
  if (!token) {
    window.location.href = "/";
  }

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch and sort transaction history from backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/user/transaction`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let transactions = response.data || [];
      if (Array.isArray(response.data.data)) {
        transactions = response.data.data;
      }
      // Sort transactions by transactionId in descending order (highest ID first)
      transactions = transactions.sort((a, b) => {
        const idA = a.transactionId || 0;
        const idB = b.transactionId || 0;
        return idB - idA;
      });
      setTransactions(transactions);
    } catch (error) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="transaction-steam-bg">
      <div className="transaction-main-steam">
        <h2 className="transaction-title-steam">{userName ? `${userName}'s Transaction History` : 'Transaction History'}</h2>
        <div className="transaction-list-steam">
          {loading ? (
            <div className="transaction-loading">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="transaction-empty-steam">No transactions found.</div>
          ) : (
            <div className="transaction-items-container">
              <table className="transaction-table-steam">
                <thead>
                  <tr>
                    <th className="transaction-th-id">Transaction ID</th>
                    <th className="transaction-th-date">Date</th>
                    <th className="transaction-th-item">Game</th>
                    <th className="transaction-th-amount">Amount</th>
                    <th className="transaction-th-changes">Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="transaction-row-steam">
                      <td className="transaction-td-id">{tx.transactionId || 'N/A'}</td>
                      <td className="transaction-td-date">{(tx.dateCreated || tx.createdAt || tx.date || '').toString().slice(0, 10)}</td>
                      <td className="transaction-td-item">{tx.gameName || tx.item || 'Unknown Item'}</td>
                      <td className="transaction-td-amount">${(tx.price ?? tx.amount ?? tx.totalAmount ?? 0).toFixed(2)}</td>
                      <td className="transaction-td-changes">- ${(tx.price ?? tx.amount ?? tx.totalAmount ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
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