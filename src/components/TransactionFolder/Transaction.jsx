import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transaction.css';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch userName from API
  useEffect(() => {
    axios.get('http://localhost:8080/users')
      .then(response => {
        console.log('Users API response:', response.data);
        const data = response.data;
        let user = null;
        if (data.data && Array.isArray(data.data)) {
          user = data.data.find(u => u.userId === 1 || u.userId === '1');
        }
        setUserName(user?.userName || '');
      })
      .catch(error => {
        console.error('Error fetching users:', error.message, error.response?.status, error.response?.data);
        setUserName('');
      });
  }, []);

  // Fetch and sort transaction history from backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/users/1/transactions');
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
                    <th className="transaction-th-date">Date</th>
                    <th className="transaction-th-item">Item</th>
                    <th className="transaction-th-amount">Amount</th>
                    <th className="transaction-th-changes">Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="transaction-row-steam">
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