import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './Cart.css';

const userId = localStorage.getItem("userId");
const username = localStorage.getItem('username');

const Cart = ({ minHeight }) => {
  if (!userId) {
    window.location.href = "/";
  }

  const [cartItems, setCartItems] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [removeConfirm, setRemoveConfirm] = useState({
    show: false,
    gameId: null,
    gameName: "",
  });

  // Add Funds Modal State
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [amountUsd, setAmountUsd] = useState(5);
  const [bankCode, setBankCode] = useState("");
  const [language, setLanguage] = useState("vn");

  useEffect(() => {
    axios.get('http://localhost:8080/user/wallet')
      .then(response => {
        setBalance(Number(response.data) || 0);
      })
      .catch(() => {
        setBalance(0);
      });
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/user/cart');
      const data = response.data;
      if (data.success && Array.isArray(data.data)) {
        setCartItems(data.data);
      } else {
        setCartItems([]);
      }
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (gameId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/user/cart/remove?gameId=${gameId}`);
      await fetchCart();
    } catch { } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/user/cart/checkout');
      if (!response.data.success) throw new Error('Purchase failed!');
      setResultMessage('Purchase successful!');
      setCartItems([]);
      await fetchCart();
      const userRes = await axios.get('http://localhost:8080/user/wallet');
      setBalance(Number(userRes.data) || 0);
    } catch (error) {
      setResultMessage("Purchase failed!");
    } finally {
      setShowResultModal(true);
      setLoading(false);
    }
  };

  const openRemoveConfirm = (gameId, gameName) => {
    setRemoveConfirm({ show: true, gameId, gameName });
  };
  const closeRemoveConfirm = () => {
    setRemoveConfirm({ show: false, gameId: null, gameName: "" });
  };
  const confirmRemove = async () => {
    if (removeConfirm.gameId) {
      await handleRemove(removeConfirm.gameId);
    }
    closeRemoveConfirm();
  };

  const total = cartItems
    .reduce((sum, item) => sum + (item.price || 0), 0)
    .toFixed(2);

  return (
    <div className="cart-steam-bg" style={{ minHeight: `${minHeight}px` }}>
      <div className="cart-main-steam">
        <h2 className="cart-title-steam">
          Your Shopping Cart
        </h2>
        <div className="cart-list-steam">
          {loading ? (
            <div className="cart-loading">Loading...</div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty-steam">Your cart is empty.</div>
          ) : (
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div className="cart-item-steam" key={item.id}>
                  <div className="cart-item-image">
                    <img
                      className="library-game-image"
                      src={item.imageUrl || "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg"}
                      alt={item.title || 'Unnamed Game'}
                    />
                  </div>
                  <div className="cart-item-title">{item.title || 'Unnamed Game'}</div>
                  <div className="cart-item-price-container">
                    <span className="cart-item-price">
                      ${item.discountPrice > 0 ? item.discountPrice.toFixed(2) : item.price?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="cart-item-remove">
                    <button
                      className="cart-item-remove-btn"
                      onClick={() => openRemoveConfirm(item.id, item.title || 'Unnamed Game')}
                      title="Remove"
                      disabled={loading}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
              <div className="cart-item-steam">
                <div className="cart-item-image"></div>
                <div className="cart-item-title">Estimated total:</div>
                <div className="cart-item-price-container">
                  <span className="cart-item-price">${total}</span>
                </div>
                <div className="cart-item-remove">
                  <span className="cart-item-empty"></span>
                </div>
              </div>
            </div>
          )}
          {cartItems.length > 0 && (
            <div className="cart-btns-steam">
              <Link className="cart-btn-steam" to="/game">Continue Shopping</Link>
              <button
                className="cart-btn-steam cart-btn-blue-steam"
                onClick={() => {
                  if (parseFloat(total) > balance) {
                    const shortfall = parseFloat(total) - balance;
                    setAmountUsd(shortfall < 5 ? 5 : parseFloat(shortfall.toFixed(2)));
                    alert("Purchase failed. Please add more funds to your account balance.");
                    setShowAddFundsModal(true);
                  } else {
                    setShowConfirmModal(true);
                  }
                }}
                disabled={cartItems.length === 0 || loading}
              >
                Purchase for Myself
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className="cart-modal-steam">
          <div className="cart-modal-content-steam">
            <h3>Confirm Purchase</h3>
            <p>Are you sure you want to purchase all games in your cart?</p>
            <div className="cart-modal-btns-steam">
              <button onClick={() => setShowConfirmModal(false)} className="cart-btn-steam">Cancel</button>
              <button onClick={handleCheckout} className="cart-btn-steam cart-btn-blue-steam" disabled={loading}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showResultModal && (
        <div className="cart-modal-steam">
          <div className="cart-modal-content-steam">
            <h3>Purchase Result</h3>
            <p>{resultMessage}</p>
            <div className="cart-modal-btns-steam">
              <button onClick={() => setShowResultModal(false)} className="cart-btn-steam">OK</button>
            </div>
          </div>
        </div>
      )}

      {removeConfirm.show && (
        <div className="cart-modal-steam">
          <div className="cart-modal-content-steam">
            <h3>Remove Game</h3>
            <p>Are you sure you want to remove <b>{removeConfirm.gameName || 'Unnamed Game'}</b> from your cart?</p>
            <div className="cart-modal-btns-steam">
              <button onClick={closeRemoveConfirm} className="cart-btn-steam">Cancel</button>
              <button onClick={confirmRemove} className="cart-btn-steam cart-btn-blue-steam" disabled={loading}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {showAddFundsModal && (
        <div className="cart-modal-steam">
          <div className="cart-modal-content-steam">
            <h2>Add Funds to Your Wallet</h2>
            <div className="amount-options">
              {[5, 10, 25, 50, 100].map((val) => (
                <button key={val} onClick={() => setAmountUsd(val)}>${val.toFixed(2)}</button>
              ))}
            </div>
            <input
              type="number"
              value={amountUsd}
              onChange={(e) => setAmountUsd(Number(e.target.value))}
              placeholder="Enter amount (USD)"
              min="5"
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
            <div className="cart-modal-btns-steam">
              <button
                onClick={async () => {
                  if (amountUsd < 5) {
                    alert("Minimum funding amount is $5.");
                    return;
                  }
                  try {
                    const params = { amount: amountUsd, language };
                    if (bankCode) params.bankCode = bankCode;

                    const res = await axios.post(
                      `http://localhost:8080/api/v1/payments/create-vnpay-payment`,
                      null,
                      { params }
                    );
                    if (res.data?.paymentUrl) {
                      window.location.href = res.data.paymentUrl;
                    } else {
                      alert("Could not create payment link.");
                    }
                  } catch (err) {
                    alert("Error creating payment link.");
                  }
                }}
                className="cart-btn-steam cart-btn-blue-steam"
              >
                Add Funds
              </button>
              <button onClick={() => setShowAddFundsModal(false)} className="cart-btn-steam">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
