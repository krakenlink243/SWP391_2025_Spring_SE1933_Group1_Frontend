import React, { useState, useEffect, forwardRef, useContext } from "react";
import "./Header.css"; // Or use CSS Modules: import styles from './Header.module.css';
import { useTranslation } from "react-i18next";
// Added by Phan NT Son
import NotificationBox from "../Notifications/NotificationBox";
import UserDropBox from "./UserDropBox";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import useIsMobile from "../../hooks/useIsMobile";

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

  const isMobile = useIsMobile();

  const { t } = useTranslation();

  const activePathMap = [
    {
      index: 0, // STORE
      paths: ["/", "/game", "/cart", "/library", "/account", "/account/wallet"],
    },
    {
      index: 1, // COMMUNITY
      paths: ["/community", "/community/threads/:threadId"], // Giữ chỗ nếu sau này mở rộng
    },
    {
      index: 2, // PROFILE
      paths: [
        "/profile",
        "/profile/friends",
        "/profile/:userId/edit/info",
        "/profile/:userId/edit/avatar",
        "/notifications",
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
        "/approvefeedback/:feedbackId",
      ],
    },
    {
      index: 5, // ADMIN
      paths: ["/admin"],
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
  const { walletBalance } = useContext(AppContext);
  if (!isMobile) {
    return (
      <div className="container-fluid" ref={ref}>
        <div className="header row">
          <div className={`col-lg-${section[0]}`}></div>
          <div
            className={`header-logo col-sm-4 col-lg-${section[1]} align-content-center`}
          >
            <Link to={"/"}>
              <img
                src="/Centurion.svg"
                alt="Centurion Logo"
                className="logo w-100"
              />
            </Link>
          </div>
          <div className={`header-nav col-lg-${section[2]}`}>
            <Link
              className={`header-nav-item ${isActive(0) ? "active" : ""}`}
              to="/"
            >
              STORE
            </Link>
            <Link
              className={`header-nav-item ${isActive(1) ? "active" : ""}`}
              to={"/community"}
            >
              COMMUNITY
            </Link>

            {username && (
              <div className="nav-user-dropdown-wrapper">
                <Link
                  className={`header-nav-item ${isActive(2) ? "active" : ""}`}
                  to="/profile"
                >
                  {username}
                </Link>
                <div className="nav-box-dropdown">
                  <Link className="submenuitem" to="/profile">
                    Profile
                  </Link>
                  <Link className="submenuitem" to="/profile/friends">
                    Friends
                  </Link>
                </div>
              </div>
            )}

            <Link
              className={`header-nav-item ${isActive(3) ? "active" : ""}`}
              to={token ? "/chat" : "#"}
            >
              {token ? "CHAT" : "ABOUT"}
            </Link>
            {role != "Admin" && (
              <Link
                className={`header-nav-item ${isActive(4) ? "active" : ""}`}
                to="/feedbackhub"
              >
                Support
              </Link>
            )}
            {role === "Admin" && (
              <Link
                className={`header-nav-item ${isActive(5) ? "active" : ""}`}
                to="/admin"
              >
                ADMIN TOOLS
              </Link>
            )}
          </div>
          <div className={`header-user-action col-lg-${section[3]}`}>
            {!token ? (
              <>
                <div className="header-user-action-content d-flex flex-column align-items-end w-100 p-2">
                  <div className="user-action-content">
                    <Link className="border-end" to="/login">
                      Login
                    </Link>
                    <Link to="/register">Register</Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="header-user-action-content d-flex flex-column align-items-end w-75 gap-2">
                  <div className="user-action-content">
                    <div className="w-25">
                      <NotificationBox />
                    </div>
                    <div className="w-50 px-2 d-flex flex-row-reverse">
                      <UserDropBox userBalance={walletBalance} />
                    </div>
                  </div>
                  <div className="user-wallet w-100">
                    {walletBalance.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>
                </div>
                <div className="header-user-action-icon w-25">
                  <Link to="/profile">
                    <img src={localStorage.getItem("avatarUrl")}></img>
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className={`col-lg-${section[4]}`}></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container-fluid" ref={ref}>
        <div class="offcanvas offcanvas-start" id="offcanvasNavbar">
          <div class="offcanvas-header">
            <h1 class="offcanvas-title">Heading</h1>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
          </div>
          <div class="offcanvas-body">
            {
              token ? (
                <div className="d-flex flex-column gap-2">
                  <div className="user-area nav-item">
                    <div className="user-info d-flex flex-row justify-content-start align-items-center">
                      <Link to="/profile">
                        <img
                          src={localStorage.getItem("avatarUrl")}
                          alt="User Avatar"
                          className="user-avatar"
                        />
                      </Link>
                      <span className="user-name">{username}</span>
                    </div>
                    <div className="user-waller">
                      {walletBalance.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </div>
                  </div>
                  <Link to={"/notifications"}> Notifications</Link>
                  <Link to={"/"}>Store</Link>
                  <Link to={'/Community'}>Community</Link>
                  <div>
                    <Link to={"/profile"}>Profile</Link>
                    <Link to={"/profile/friends"}>Friends</Link>
                  </div>
                  <Link to={'/chat'}>Chat</Link>
                  <Link to={'/feedbackhub'}>Support</Link>
                </div>
              ) : (
                <div>
                  <Link to={"/login"} className="nav-item">Login</Link>
                  <Link to={"/"} className="nav-item">Store</Link>
                  <Link to={"/community"} className="nav-item">Community</Link>
                  <Link to={"#"} className="nav-item">About</Link>
                  <Link to={"/feedbackhub"} className="nav-item">Support</Link>
                </div>
              )
            }
          </div>
        </div>
        <div className="header row">
          <div
            className="col-1 d-flex justify-content-center align-items-center"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            role="button" aria-label="Toggle navigation"
            style={{ cursor: 'pointer' }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M4 12H20M4 18H20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
          </div>
          <div className="spacer col-3"></div>
          <div className="col-4 d-flex flex-column justify-content-center align-items-center">
            <Link to={"/"}>
              <img
                src="/Centurion.svg"
                alt="Centurion Logo"
                className="logo h-100 w-100"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

});

export default Header;
