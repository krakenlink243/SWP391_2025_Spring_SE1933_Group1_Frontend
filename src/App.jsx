import { useState } from 'react';
import './App.css';
import steamLogo from './steam-logo.png'; // Replace with the actual Steam logo file

const CartItem = ({ name, price, image, onRemove }) => (
  <div className="cart-item">
    <img src={image} alt={name} className="cart-item-image" />
    <div className="cart-item-details">
      <span>{name}</span>
      <span>${price}</span>
    </div>
    <button className="remove-btn" onClick={onRemove}>🗑️</button>
  </div>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirm Purchase</h2>
        <p>Are you sure to buy?</p>
        <div className="modal-buttons">
          <button className="modal-btn cancel-btn" onClick={onClose}>Cancel</button>
          <button className="modal-btn confirm-btn" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const ResultModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Purchase Result</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="modal-btn ok-btn" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [cartItems, setCartItems] = useState([
    { name: 'Elden Ring', price: 59.99, image: 'https://via.placeholder.com/150' },
    { name: 'Elden Ring', price: 59.99, image: 'https://via.placeholder.com/150' },
    { name: 'Elden Ring', price: 59.99, image: 'https://via.placeholder.com/150' },
  ]);
  const [balance, setBalance] = useState(5.35); // User's balance
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleRemoveItem = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handlePurchase = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmPurchase = () => {
    setShowConfirmModal(false);
    if (balance >= total) {
      setResultMessage('Buy game successfully');
      setBalance((prev) => prev - total); // Deduct the total from balance
      setCartItems([]); // Clear the cart after successful purchase
    } else {
      setResultMessage('Account balance not enough, buy game unsuccessfully');
    }
    setShowResultModal(true);
  };

  const handleCloseModals = () => {
    setShowConfirmModal(false);
    setShowResultModal(false);
  };

  const handleHomeClick = () => {
    // Placeholder for redirect to home page
    console.log('Home button clicked! Redirect to home page here.');
  };

  return (
    <div className="app-container">
      <div className="top-nav-stretch">
        <div className="top-nav">
          <div className="nav-left">
            <div className="logo-and-links">
              <img src={steamLogo} alt="Steam Logo" className="steam-logo" />
              <span className="site-name">SteamCL</span>
              <div className="nav-links">
                <a href="#store">STORE</a>
                <a href="#juxtopposed">JUXTOPPOSED</a>
                <a href="#library">LIBRARY</a>
              </div>
            </div>
            <div className="home-and-search">
              <button className="home-btn" onClick={handleHomeClick}>Home</button>
              <div className="search-bar">
                <input type="text" placeholder="Search..." />
                <button className="search-btn">🔍</button>
              </div>
            </div>
          </div>
          <div className="nav-right">
            <div className="user-info">
              <span className="user-name">Juxtopposed (${balance.toFixed(2)})</span>
              <span className="user-icons">
                <span>🔔</span>
                <span>📥</span>
                <span>👤</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="main-content">
        <h1>Juxtopposed's Shopping Cart</h1>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <CartItem
                key={index}
                name={item.name}
                price={item.price}
                image={item.image}
                onRemove={() => handleRemoveItem(index)}
              />
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <>
            <div className="cart-total">
              <p>Estimated total: ${total.toFixed(2)}</p>
            </div>
            <div className="cart-buttons">
              <button className="continue-btn">Continue Shopping</button>
              <button className="purchase-btn" onClick={handlePurchase}>Purchase for Myself</button>
            </div>
          </>
        )}
        <div className="footer">
          <div className="footer-logo">VALVE © STEAM</div>
          <div className="footer-links">
            <a href="#about">About Valve</a> | <a href="#jobs">Jobs</a> | <a href="#steamworks">Steamworks</a> | <a href="#support">Support</a> | <a href="#privacy">Privacy Policy</a> | <a href="#legal">Legal</a>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModals}
        onConfirm={handleConfirmPurchase}
      />
      <ResultModal
        isOpen={showResultModal}
        onClose={handleCloseModals}
        message={resultMessage}
      />
    </div>
  );
};

export default App;