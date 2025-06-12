import React from "react";
import {useState} from "react";
import "./Header.css"; // Or use CSS Modules: import styles from './Header.module.css';

// Added by Phan NT Son
import Logout from "../Logout";

const Header = () => {
  // Added by Phan NT Son
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [showLogout, setShowLogout] = useState(false);

  return (
    <header className="steam-header">
      {" "}
      <a href="/">
        <img src="/logo_steam.svg" alt="Steam Logo" className="logo" />
      </a>
      <nav>
        <a href="/">STORE</a>
        {/* Adjustment by Phan NT Son*/}
        {/* <a href="#">COMMUNITY</a>
        <a href="#">ABOUT</a>
        <a href="#">SUPPORT</a> */}
      </nav>
      <div className="user-actions">

        {/* Adjustment by Phan NT Son*/}
        {!token ?
          (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          ) : (<>
            <a>{username}</a>
            {role == 2 ? (<a href="/sendgame">Request Add Game</a>) : (<></>)}
            {role == 3 ? (<a href="/aprrovegame">Approve Game</a>) : (<></>)}
            <a href="/transaction">Transaction</a>
            <a href="/cart">Cart</a>
            <a href="/notifications">Notifications</a>
            <button onClick={() => setShowLogout(true)}>Logout</button>

            {showLogout && <Logout onClose={() => setShowLogout(false)} />}
          </>)
        }


      </div>
    </header>
  );
};

export default Header;
