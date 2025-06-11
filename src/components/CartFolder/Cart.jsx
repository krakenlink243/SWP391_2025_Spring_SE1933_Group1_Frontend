import React, { useState, useEffect } from "react";
import "./Cart.css"; // Import your CSS file for styling
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [balance, setBalance] = useState(1000); // Khởi tạo tài khoản 1000$
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [removeConfirm, setRemoveConfirm] = useState({
    show: false,
    gameId: null,
    gameName: "",
  });

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

  // Lấy cart từ BE
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/users/1/cart");
      const data = await res.json();
      setCartItems(data.data?.cartItems || []);
      if (data.data?.balance) setBalance(data.data.balance);
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
      await fetch(`http://localhost:8080/users/1/cart/remove?gameId=${gameId}`);
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
      if (balance < total) throw new Error("Insufficient balance");
      const res = await axios.get(
        "http://localhost:8080/users/1/cart/checkout"
      );
      // console.log("Checkout response:", res.data);
      // if (!res.ok) throw new Error("Checkout failed");
      setResultMessage("Purchase successful!");
      setCartItems([]);
      fetchCart();
    } catch (e) {
      console.error("Checkout error:", e);
      setResultMessage(
        e.message === "Insufficient balance"
          ? "Insufficient balance!"
          : "Purchase failed!"
      );
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
      <div className="cart-header-steam">
        <span className="cart-steam-title">STEAM</span>
        <span className="cart-user">{userName}</span>
        <span className="cart-balance">${balance.toFixed(2)}</span>
      </div>
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
            <>
              <div className="cart-list-header-steam">
                <div></div>
                <div
                  className="cart-item-price-steam"
                  style={{ textAlign: "right", paddingRight: "8px" }}
                >
                  Price
                </div>
                <div></div>
              </div>
              {cartItems.map((item) => (
                <div className="cart-item-steam" key={item.gameId}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* Ảnh game */}
                    <img
                      src={
                        item.imageUrl ||
                        "https://via.placeholder.com/60x60?text=Game"
                      }
                      alt={item.gameName}
                      className="cart-item-img-steam"
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                        marginRight: 16,
                        background: "#222",
                      }}
                    />
                    {/* Tên game */}
                    <div className="cart-item-info-steam">
                      <div className="cart-item-title-steam">
                        {item.gameName}
                      </div>
                    </div>
                  </div>
                  <div className="cart-item-price-steam">
                    <span className="cart-item-sale-steam">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <button
                      className="cart-item-remove-steam"
                      onClick={() =>
                        openRemoveConfirm(item.gameId, item.gameName)
                      }
                      title="Remove"
                      disabled={loading}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
              <div className="cart-total-steam">
                <div>Estimated total:</div>
                <div className="cart-total-price-steam">${total}</div>
                <div></div>
              </div>
              <div className="cart-btns-steam">
                <button
                  className="cart-btn-steam"
                  onClick={() => (window.location.href = "/game")}
                  style={{ marginRight: "auto" }}
                >
                  Continue Shopping
                </button>
                <button
                  className="cart-btn-steam cart-btn-blue-steam"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={
                    cartItems.length === 0 || loading || total > balance
                  }
                >
                  Purchase for Myself
                </button>
              </div>
            </>
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
            <p>
              Are you sure you want to remove <b>{removeConfirm.gameName}</b>{" "}
              from your cart?
            </p>
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
