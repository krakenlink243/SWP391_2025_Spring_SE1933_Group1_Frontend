import React, { useState, useEffect, forwardRef } from "react";
import "./Header.css"; // Or use CSS Modules: import styles from './Header.module.css';
// Added by Phan NT Son
import NotificationBox from "../Notifications/NotificationBox";
import UserDropBox from "./UserDropBox";
import axios from "axios";
import { useLocation } from "react-router";

/**
 * @author Origin belongs to TS Huy
 * @author Adjust and re-design by Phan NT Son
 * @returns header of website
 */
const Header = forwardRef((props, ref) => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const section = [2, 2, 4, 2, 2];
  const location = useLocation();
  const CUR_PATHNAME = location.pathname;

  const activePathMap = [
    {
      index: 0, // STORE
      paths: [
        "/", 
        "/game", 
        "/cart", 
        "/library",
        "/account",
        "/account/wallet",
      ],
    },
    {
      index: 1, // COMMUNITY
      paths: ["/community"], // Giữ chỗ nếu sau này mở rộng
    },
    {
      index: 2, // PROFILE
      paths: [
        "/profile",
        "/profile/friends",
        "/profile/:userId/edit/info",
        "/profile/:userId/edit/avatar",
        "/notifications"
      ],
    },
    {
      index: 3, // CHAT
      paths: ["/chat"],
    },
    {
      index: 4, // SUPPORT
      paths: [
        "/sendpublisher",
        "/feedbackhub",
        "/feedbackhub/:feedbackId",
        "/sendfeedback",
        "/approvefeedback",
        "/approvefeedback/:feedbackId"
      ],
    },
    {
      index: 5, // ADMIN
      paths: [
        "/admin",
        "/aprrovegame",
        "/aprrovegame/:gameId",
        "/approvepublisher",
        "/approvepublisher/:publisherId"
      ],
    },
  ];

  const normalizePath = (path) => path.replace(/\/:[^/]+/g, ""); // bỏ :params

  const getActivePathIndex = (pathname) => {
    for (const group of activePathMap) {
      for (const pattern of group.paths) {
        const base = normalizePath(pattern);
        if (pathname === base || pathname.startsWith(base + "/")) {
          return group.index;
        }
      }
    }
    return -1; // Không khớp
  };

  const currentIndex = getActivePathIndex(CUR_PATHNAME);

  const isActive = (index) => currentIndex === index;



  /**
   * @author Bathanh
   *add methods allows to get user balance from backend
   *create a separate api for wallet balance
   * @returns user balance
   */
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const getUserBalance = () => {
      axios
        .get(`http://localhost:8080/user/wallet`)
        .then((response) => setBalance(response.data))
        .catch((error) => alert(error));
    };
    if (token) {
      getUserBalance();
    }
  }, []);


  return (
    <div className="container-fluid" ref={ref}>
      <div className="header row">
        <div className={`col-lg-${section[0]}`}></div>
        <div
          className={`header-logo col-lg-${section[1]} align-content-center`}
        >
          <a href="/">
            <img
              src="/logo_steam.svg"
              alt="Steam Logo"
              className="logo w-100"
            />
          </a>
        </div>
        <div className={`header-nav col-lg-${section[2]}`}>
          <a className={`header-nav-item ${isActive(0) ? "active" : ""}`} href="/">STORE</a>
          <a className={`header-nav-item ${isActive(1) ? "active" : ""}`} href="#">COMMUNITY</a>
          {username && (
            <div className="nav-user-dropdown-wrapper">
              <a className={`header-nav-item ${isActive(2) ? "active" : ""}`} href="/profile">{username}</a>
              <div className="nav-box-dropdown">
                <a className="submenuitem" href="/profile">Profile</a>
                <a className="submenuitem" href="/profile/friends">Friends</a>
              </div>
            </div>
          )}

          <a className={`header-nav-item ${isActive(3) ? "active" : ""}`} href={token && '/chat'}>{token ? "CHAT" : "ABOUT"}</a>
          {role != 'Admin' && <a className={`header-nav-item ${isActive(4) ? "active" : ""}`} href="/feedbackhub">Support</a>}
          {role === 'Admin' && <a className={`header-nav-item ${isActive(5) ? "active" : ""}`} href="/aprrovegame">ADMIN TOOLS</a>}
        </div>
        <div className={`header-user-action col-lg-${section[3]}`}>
          {!token ? (
            <>
              <div className="header-user-action-content d-flex flex-column align-items-end w-100 p-2">
                <div className="user-action-content">
                  <a href="/login" className="border-end">
                    Login
                  </a>
                  <a href="/register">Register</a>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="header-user-action-content d-flex flex-column align-items-end w-75 ">
                <div className="user-action-content">

                  <div className="w-25">
                    <NotificationBox />
                  </div>
                  <div className="w-50 px-2 d-flex flex-row-reverse">
                    <UserDropBox userBalance={balance} />
                  </div>
                </div>
                <div className="user-wallet w-100">
                  {balance.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
              </div>
              <div className="header-user-action-icon w-25">
                <a href="/profile"><img src={localStorage.getItem("avatarUrl")}></img></a>
              </div>
            </>
          )}
        </div>

        <div className={`col-lg-${section[4]}`}></div>
      </div>
    </div>
  );
});

export default Header;
