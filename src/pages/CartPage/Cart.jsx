import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './Cart.css';
import { isTokenExpired } from '../../utils/validators';

/**
 * @author BaThanh
 * @description Component for showing cart, removing games from cart, and checkout cart.
 * @param {*} param0 
 * @returns 
 */
const userId = localStorage.getItem("userId");
const username = localStorage.getItem('username');
const CUR_TOKEN = localStorage.getItem('token');

const Cart = ({ minHeight }) => { // Added bt Phan Nt Son 18-06-2025

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

  // Fetch balance from API http://localhost:8080/user/wallet
  useEffect(() => {
    if (CUR_TOKEN && !isTokenExpired()) {
      axios.get('http://localhost:8080/user/wallet')
        .then(response => {
          console.log('Wallet API response:', response.data);
          setBalance(Number(response.data) || 0);
        })
        .catch(error => {
          console.error('Error fetching wallet balance:', error.message, error.response?.status, error.response?.data);
          setBalance(0);
        });
    }
  }, []);

  // Fetch cart từ backend
  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/user/cart');
      console.log('Cart API response:', response.data);
      const data = response.data;
      if (data.success && Array.isArray(data.data)) {
        setCartItems(data.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error.message, error.response?.status, error.response?.data);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (CUR_TOKEN && !isTokenExpired()) {
      fetchCart();
    }
  }, []);

  const handleRemove = async (gameId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/user/cart/remove?gameId=${gameId}`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing game:', error.message, error.response?.status, error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
      const response = await axios.post('http://localhost:8080/user/cart/checkout');
      if (!response.data.success) throw new Error('Checkout failed');
      setResultMessage('Purchase successful!');
      setCartItems([]);
      await fetchCart();
      const userRes = await axios.get('http://localhost:8080/user/wallet');
      console.log('Updated wallet response:', userRes.data);
      setBalance(Number(userRes.data) || 0);
    } catch (error) {
      setResultMessage(error.message === 'Purchase failed!');
      console.error('Error during checkout:', error.message, error.response?.status, error.response?.data);
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
                      src={
                        item.imageUrl
                          ? item.imageUrl
                          : "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg" // fallback
                      }
                      alt={item.title || 'Unnamed Game'}
                    />
                  </div>
                  <div className="cart-item-title">{item.title || 'Unnamed Game'}</div>
                  <div className="cart-item-price-container">
                    <span className="cart-item-price">${item.discountPrice > 0 ? item.discountPrice.toFixed(2) : item.price?.toFixed(2) || '0.00'}</span>
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
                <div className="cart-item-image"></div> {/* Placeholder để giữ cấu trúc flex */}
                <div className="cart-item-title">Estimated total:</div>
                <div className="cart-item-price-container">
                  <span className="cart-item-price">${total}</span>
                </div>
                <div className="cart-item-remove">
                  <span className="cart-item-empty"></span> {/* Placeholder cho nút remove */}
                </div>
              </div>
            </div>
          )}
          {cartItems.length > 0 && (
            <div className="cart-btns-steam">
              <Link className="cart-btn-steam" to="/game">Continue Shopping</Link>
              <button
                className="cart-btn-steam cart-btn-blue-steam"
                onClick={() => setShowConfirmModal(true)}
                disabled={cartItems.length === 0 || loading || total > balance}
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
              <button
                onClick={() => setShowConfirmModal(false)}
                className="cart-btn-steam"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="cart-btn-steam cart-btn-blue-steam"
                disabled={loading}
              >
                Confirm
              </button>
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
              <button
                onClick={() => setShowResultModal(false)}
                className="cart-btn-steam"
              >
                OK
              </button>
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
              <button onClick={closeRemoveConfirm} className="cart-btn-steam">
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="cart-btn-steam cart-btn-blue-steam"
                disabled={loading}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;