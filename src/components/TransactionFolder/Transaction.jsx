import React, { useState, useEffect } from "react";
import "./Transaction.css"; // Import your CSS file for styling

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy userName từ API /users (userId=1)
  useEffect(() => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((data) => {
        let user = null;
        if (Array.isArray(data)) {
          user = data.find((u) => u.userId === 1 || u.userId === "1");
        } else if (data && Array.isArray(data.data)) {
          user = data.data.find((u) => u.userId === 1 || u.userId === "1");
        }
        setUserName(user?.userName || "");
      })
      .catch(() => setUserName(""));
  }, []);

  // Lấy transaction history từ BE
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/users/1/transactions");
      const data = await res.json();
      setTransactions(data.data || []);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="cart-steam-bg">
      <div className="cart-main-steam">
        <h2 className="cart-title-steam">Transaction History</h2>
        <div className="cart-list-steam">
          {loading ? (
            <div className="cart-loading">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="cart-empty-steam">No transactions found.</div>
          ) : (
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
                    <td className="transaction-td-date">
                      {(tx.dateCreated || tx.createdAt || tx.date || "")
                        .toString()
                        .slice(0, 10)}
                    </td>
                    <td className="transaction-td-item">
                      {tx.gameName || tx.item || ""}
                    </td>
                    <td className="transaction-td-amount">
                      $
                      {(tx.price ?? tx.amount ?? tx.totalAmount ?? 0).toFixed(
                        2
                      )}
                    </td>
                    <td className="transaction-td-changes">
                      -{" "}
                      {(tx.price ?? tx.amount ?? tx.totalAmount ?? 0).toFixed(
                        2
                      )}
                      $
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
