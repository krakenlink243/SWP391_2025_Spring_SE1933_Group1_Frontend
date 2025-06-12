import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [removeConfirm, setRemoveConfirm] = useState({
    show: false,
    gameId: null,
    gameName: "",
  });

  // Fetch userName và balance từ API http://localhost:8080/users
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
        setBalance(user?.walletBalance || 0);
      })
      .catch(error => {
        console.error('Error fetching users:', error.message, error.response?.status, error.response?.data);
        setUserName('');
        setBalance(0);
      });
  }, []);

  // Fetch cart từ backend
  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/users/1/cart');
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
    fetchCart();
  }, []);

  const handleRemove = async (gameId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/users/1/cart/remove?gameId=${gameId}`);
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
      if (balance < total) throw new Error('Insufficient balance');
      const response = await axios.post('http://localhost:8080/users/1/cart/checkout');
      if (!response.data.success) throw new Error('Checkout failed');
      setResultMessage('Purchase successful!');
      setCartItems([]);
      await fetchCart();
      const userRes = await axios.get('http://localhost:8080/users');
      console.log('Updated users response:', userRes.data);
      const userData = userRes.data;
      const updatedUser = userData.data?.find(u => u.userId === 1);
      setBalance(updatedUser?.walletBalance || 0);
    } catch (error) {
      setResultMessage(error.message === 'Insufficient balance' ? 'Insufficient balance!' : 'Purchase failed!');
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
    <div className="cart-steam-bg">
      <div className="cart-main-steam">
        <h2 className="cart-title-steam">
          {userName ? `${userName}'s Shopping Cart` : "Shopping Cart"}
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
                <div className="cart-item-title">Estimated total:</div>
                <div className="cart-item-price-container">
                  <span className="cart-item-price">${total}</span>
                </div>
                <div className="cart-item-empty"></div>
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
