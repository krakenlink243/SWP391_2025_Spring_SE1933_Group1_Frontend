  import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './Cart.css';
import { isTokenExpired } from '../../utils/validators';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';


const Cart = () => {
  const { token: CUR_TOKEN } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();


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

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/cart`);
      const data = response.data;
      if (data.success && Array.isArray(data.data)) {
        setCartItems(data.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
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

  useEffect(() => {
    if (!CUR_TOKEN || isTokenExpired()) {
      navigate("/");
    }
  }, [])

  const handleRemove = async (gameId) => {
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/user/cart/remove?gameId=${gameId}`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/cart/checkout`);
      if (!response.data.success) throw new Error(t('Purchase failed!'));
      setResultMessage(t('Purchase successful!'));
      setCartItems([]);
      await fetchCart();
      const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/user/wallet`);
      setBalance(Number(userRes.data) || 0);
      setShowResultModal(true); // chỉ hiển thị modal khi thành công
    } catch (error) {
      if (parseFloat(total) > balance) {
        const params = {
          amount: total,
          language: "en",
        };
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/payments/create-vnpay-payment`,
          null,
          { params: params }
        );
        const { paymentUrl } = response.data;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      } else {
        alert(t('Purchase failed due to an unknown error.'));
      }
    } finally {
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

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);

  return (
    <div className="cart-steam-bg h-100">
      <div className="cart-main-steam">
        <h2 className="cart-title-steam">{t('Your Shopping Cart')}</h2>
        <div className="cart-list-steam">
          {loading ? (
            <div className="cart-loading">{t('Loading...')}</div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty-steam">{t('Your cart is empty.')}</div>
          ) : (
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div className="cart-item-steam" key={item.id}>
                  <div className="cart-item-image">
                    <div className='media-with-caption'>
                      <img
                        className="library-game-image"
                        src={item.imageUrl || "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg"}
                        alt={item.title || 'Unnamed Game'}
                      />
                    </div>
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
                      onClick={() => openRemoveConfirm(item.id, item.title || t('Unnamed Game'))}
                      title="Remove"
                      disabled={loading}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
              <div className="cart-item-steam">
                <div className="cart-item-image" />
                <div className="cart-item-title">{t('Estimated total')}:</div>
                <div className="cart-item-price-container">
                  <span className="cart-item-price">${total}</span>
                </div>
                <div className="cart-item-remove" />
              </div>
            </div>
          )}
          {cartItems.length > 0 && (
            <div className="cart-btns-steam">
              <Link className="cart-btn-steam" to="/game">{t('Continue Shopping')}</Link>
              <button
                className="cart-btn-steam cart-btn-blue-steam"
                onClick={() => setShowConfirmModal(true)}
                disabled={cartItems.length === 0 || loading}
              >
                {t('Purchase for Myself')}
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className="cart-modal-steam">
          <div className="cart-modal-content-steam">
            <h3>{t('Confirm Purchase')}</h3>
            <p>{t('Are you sure you want to purchase all games in your cart?')}</p>
            <div className="cart-modal-btns-steam">
              <button onClick={() => setShowConfirmModal(false)} className="cart-btn-steam">{t('Cancel')}</button>
              <button onClick={handleCheckout} className="cart-btn-steam cart-btn-blue-steam" disabled={loading}>{t('Confirm')}</button>
            </div>
          </div>
        </div>
      )}

      {showResultModal && (
        <div className="cart-modal-steam">
          <div className="cart-modal-content-steam">
            <h3>{t('Purchase Result')}</h3>
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
            <h3>{t('Remove Game')}</h3>
            <p>{t('Are you sure you want to remove gameName from your cart?', {gameName: removeConfirm.gameName})}</p>
            <div className="cart-modal-btns-steam">
              <button onClick={closeRemoveConfirm} className="cart-btn-steam">{t('Cancel')}</button>
              <button onClick={confirmRemove} className="cart-btn-steam cart-btn-blue-steam" disabled={loading}>{t('Remove')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
