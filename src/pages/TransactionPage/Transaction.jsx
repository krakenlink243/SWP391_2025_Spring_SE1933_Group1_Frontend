import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transaction.css';

/**
 * @author BaThanh
 * @description Component for showing transaction
 * @param {*} param0 
 * @returns 
 */
const userId = localStorage.getItem("userId");
const username = localStorage.getItem('username');

const Transaction = () => {
  if (!userId) {
    window.location.href = "/";
  }

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch and sort transaction history from backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/transaction`);
      console.log('Transactions API response:', response.data);
      let transactions = response.data.data || [];

      // Sort transactions by transactionId in descending order (highest ID first)
      transactions = transactions.sort((a, b) => {
        const idA = a.transactionId || 0;
        const idB = b.transactionId || 0;
        return idB - idA; // Descending order: higher transactionId first
      });

      setTransactions(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error.message, error.response?.status, error.response?.data);
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
    window.location.href = `/transaction/detail/${transactionId}`;
  };

  return (
    <div className="transaction-steam-bg">
      <div className="transaction-main-steam">
        <h2 className="transaction-title-steam">{username ? `${username}'s Purchase History` : 'Purchase History'}</h2>
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
                    <th className="transaction-th-date">Date</th>
                    <th className="transaction-th-item">Game</th>
                    <th className="transaction-th-type">Type</th>
                    <th className="transaction-th-amount">Amount</th>
                    <th className="transaction-th-changes">Changes</th>
                    <th className="transaction-th-detail">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="transaction-row-steam">
                      <td className="transaction-td-date">{(tx.dateCreated || tx.createdAt || tx.date || '').toString().slice(0, 10)}</td>
                      <td className="transaction-td-item">{tx.gameName || tx.item || 'Unknown Item'}</td>
                      <td className="transaction-td-type">Purchase Game</td>
                      <td className="transaction-td-amount">${(tx.price ?? tx.amount ?? tx.totalAmount ?? 0).toFixed(2)}</td>
                      <td className="transaction-td-changes">- ${(tx.price ?? tx.amount ?? tx.totalAmount ?? 0).toFixed(2)}</td>
                      <td className="transaction-td-detail" onClick={() => handleDetailClick(tx.transactionId)}>Detail</td>
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