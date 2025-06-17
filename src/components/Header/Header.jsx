import React, { useState, useEffect } from 'react';
import "./Header.css"; // Or use CSS Modules: import styles from './Header.module.css';
// Added by Phan NT Son
import NotificationBox from "../Notifications/NotificationBox"
import UserDropBox from "./UserDropBox";
import axios from 'axios';

/**
 * @author Origin belongs to TS Huy
 * @author Adjust and re-design by Phan NT Son
 * @returns header of website
 */
const Header = () => {
  const token = localStorage.getItem("token");

  const section = [2, 2, 4, 3, 1]
  /**
   * @author Bathanh
   *add methods allows to get user balance from backend
   *create a separate api for wallet balance
   * @returns user balance
   */
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios.get("http://localhost:8080/users")
        .then(res => {
          const users = res.data.data || [];
          const user = users.find(u => u.userId === Number(userId));
          setBalance(user?.walletBalance || 0);
        })
        .catch(() => setBalance(0));
    }
  }, []);

  return (
    <div className="container-fluid">
      <div className="header row">
        <div className={`col-lg-${section[0]}`}></div>
        <div className={`header-logo col-lg-${section[1]} align-content-center`}>
          <a href="/"><img src="/logo_steam.svg" alt="Steam Logo" className="logo w-100" /></a>
        </div>
        <div className={`header-nav col-lg-${section[2]}`}>
          <a href="/">STORE</a>
          <a href="#">COMMUNITY</a>
          <a href="#">ABOUT</a>
          <a href="#">SUPPORT</a>
        </div>
        <div className={`header-user-action col-lg-${section[3]}`}>
          {!token ?
            (
              <>
                <div className="header-user-action-content d-flex flex-column align-items-end w-100 p-2">
                  <div className="user-action-content">
                    <a href="/login" className="border-end">Login</a>
                    <a href="/register">Register</a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="header-user-action-content d-flex flex-column align-items-end w-75 p-2">
                  <div className="user-action-content">
                    <a href="/cart" className="w-25 px-2">Cart</a>
                    <div className="w-25 px-2">
                      <NotificationBox />
                    </div>
                    <div className="w-50 px-2 d-flex flex-row-reverse">
                      <UserDropBox />
                    </div>

                  </div>
                  <div className="user-wallet w-50">
                    ${balance}
                  </div>
                </div>
                <div className="header-user-action-icon w-25">
                  <p className="">Icon</p>
                </div>
              </>
            )
          }
        </div>

        <div className={`col-lg-${section[4]}`}></div>
      </div>

    </div>
  );
};

export default Header;
