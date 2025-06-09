import React from "react";
import "./Header.css"; // Or use CSS Modules: import styles from './Header.module.css';

const Header = () => {
  return (
    <header className="steam-header">
      {" "}
      <a href="/">
        <img src="/logo_steam.svg" alt="Steam Logo" className="logo" />
      </a>
      <nav>
        <a href="/">STORE</a>
        <a href="#">COMMUNITY</a>
        <a href="#">ABOUT</a>
        <a href="#">SUPPORT</a>
      </nav>
      <div className="user-actions">
        <a href="/login">Login</a>
        <a href="/register">Register</a>
        <a href="/sendgame">Request Add Game</a>
        <a href="/aprrovegame">Approve Game</a>
        <a href="/transaction">Transaction</a>
        <a href="/cart">Cart</a>
      </div>
    </header>
  );
};

export default Header;
