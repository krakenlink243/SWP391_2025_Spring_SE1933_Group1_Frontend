import React, { useState, useEffect, forwardRef } from "react";
import "./Header.css"; // Or use CSS Modules: import styles from './Header.module.css';
// Added by Phan NT Son
import NotificationBox from "../Notifications/NotificationBox";
import UserDropBox from "./UserDropBox";
import axios from "axios";
import { useLocation } from "react-router";
import { isTokenExpired } from "../../utils/validators";
import { NotificationProvider } from "../../services/notification";
import { Link } from "react-router-dom";

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
        .get(`${import.meta.env.VITE_API_URL}/user/wallet`)
        .then((response) => setBalance(response.data))
        .catch((error) => alert(error));
    };
    if (token && !isTokenExpired()) {
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
          <Link to={"/"}>
            <img
              src="/logo_steam.svg"
              alt="Steam Logo"
              className="logo w-100"
            />
          </Link>
        </div>
        <div className={`header-nav col-lg-${section[2]}`}>
          <Link className={`header-nav-item ${isActive(0) ? "active" : ""}`} to="/">
            STORE
          </Link>
          <Link className={`header-nav-item ${isActive(1) ? "active" : ""}`} to={"#"} >
            COMMUNITY
          </Link>
          
          {username && (
            <div className="nav-user-dropdown-wrapper">
              <Link className={`header-nav-item ${isActive(2) ? "active" : ""}`} to="/profile">{username}</Link>
              <div className="nav-box-dropdown">
                <Link className="submenuitem" to="/profile">Profile</Link>
                <Link className="submenuitem" to="/profile/friends">Friends</Link>
              </div>
            </div>
          )}

          <Link className={`header-nav-item ${isActive(3) ? "active" : ""}`} to={token ? '/chat' : '#'}>{token ? "CHAT" : "ABOUT"}</Link>
          {role != 'Admin' && <Link className={`header-nav-item ${isActive(4) ? "active" : ""}`} to="/feedbackhub">Support</Link>}
          {role === 'Admin' && <Link className={`header-nav-item ${isActive(5) ? "active" : ""}`} to="/admin">ADMIN TOOLS</Link>}
        </div>
        <div className={`header-user-action col-lg-${section[3]}`}>
          {!token ? (
            <>
              <div className="header-user-action-content d-flex flex-column align-items-end w-100 p-2">
                <div className="user-action-content">
                  <Link className="border-end" to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="header-user-action-content d-flex flex-column align-items-end w-75 gap-2">
                <div className="user-action-content">

                  <div className="w-25">
                    <NotificationProvider>
                      <NotificationBox />

                    </NotificationProvider>
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
                <Link to="/profile"><img src={localStorage.getItem("avatarUrl")}></img></Link>
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
