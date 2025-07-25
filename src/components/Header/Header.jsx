import React, { useState, useEffect, forwardRef, useContext, useRef } from "react";
import "./Header.css"; // Or use CSS Modules: import styles from './Header.module.css';
import { useTranslation } from "react-i18next";
import NotificationBox from "../Notifications/NotificationBox";
import UserDropBox from "./UserDropBox";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import useIsMobile from "../../hooks/useIsMobile";
import { useAuth } from "../../context/AuthContext";

/**
 * @author Origin belongs to TS Huy
 * @author Adjust and re-design by Phan NT Son
 * @returns header of website
 */
const Header = forwardRef((props, ref) => {

  const { token } = useAuth();

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const section = [2, 2, 4, 2];
  const location = useLocation();
  const CUR_PATHNAME = location.pathname;
  const handleDownload = () => {
    const downloadUrl =
      "https://drive.google.com/file/d/1eGUIrk5u5qhwqv8ls69OwYHNypw_oWRW/view?usp=sharing";
    window.open(downloadUrl, "_blank");
  };

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
      paths: ["/chat",
        "/about-us",
      ],

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

  const { walletBalance } = useContext(AppContext);

  const [isHover, setIsHover] = useState(false);

  if (!isMobile) {
    return (
      <div className="container-fluid" ref={ref}>
        <div className="header row">
          <div className={`col-lg-${section[0]}`}></div>
          <div className={`header-logo col-sm-4 col-lg-${section[1]} align-content-center`}>
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
              <Link
                className={`header-nav-item ${isActive(2) ? "active" : ""} `}
                to="/profile"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}

              >
                {username}
              </Link>
            )}

            {
              token && (
                <div className="nav-box-dropdown"
                  style={{ opacity: isHover ? "1" : "0", pointerEvents: isHover ? "auto" : "none" }}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                >
                  <Link className="submenuitem" to="/profile">
                    Profile
                  </Link>
                  <Link className="submenuitem" to="/profile/friends">
                    Friends
                  </Link>
                </div>
              )
            }

            <Link
              className={`header-nav-item ${isActive(3) ? "active" : ""}`}
              to={token ? "/chat" : "/about-us"}
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
            <div className={`header-user-action`}>
              {!token ? (
                <>
                  <div className="header-user-action-content ">
                    <div className="user-action-content">
                      <div className="header-download-btn" onClick={() => handleDownload()}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: "21px" }} className="mw-1"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5H7C5.89543 5 5 5.89543 5 7V16H19V12.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3 16H21V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V16Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M18.5 3V9M18.5 9L16 6.5M18.5 9L21 6.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        Install Centurion
                      </div>
                      <Link className="border-end" to="/login">
                        Login
                      </Link>
                      <Link to="/register">Register</Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="header-user-action-content ">
                    <div className="user-action-content">
                      <div className="header-download-btn" onClick={() => handleDownload()}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: "21px" }} className="mw-1"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5H7C5.89543 5 5 5.89543 5 7V16H19V12.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M3 16H21V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V16Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M18.5 3V9M18.5 9L16 6.5M18.5 9L21 6.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        Install Centurion
                      </div>
                      <NotificationBox />
                      <div className="px-2 d-flex flex-row-reverse">
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
                  <div className="header-user-action-icon">
                    <Link to="/profile">
                      <img src={localStorage.getItem("avatarUrl")}></img>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>


          <div className={`col-lg-${section[3]}`}></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container-fluid" ref={ref}>
        <div class="offcanvas offcanvas-start" id="offcanvasNavbar">
          <div class="offcanvas-header">
            <h1 class="offcanvas-title">Heading</h1>
            <button
              type="button"
              class="btn-close text-reset"
              data-bs-dismiss="offcanvas"
            ></button>
          </div>
          <div class="offcanvas-body">
            {token ? (
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
                <Link to={"/Community"}>Community</Link>
                <div>
                  <Link to={"/profile"}>Profile</Link>
                  <Link to={"/profile/friends"}>Friends</Link>
                </div>
                <Link to={"/chat"}>Chat</Link>
                <Link to={"/feedbackhub"}>Support</Link>
              </div>
            ) : (
              <div>
                <Link to={"/login"} className="nav-item">
                  Login
                </Link>
                <Link to={"/"} className="nav-item">
                  Store
                </Link>
                <Link to={"/community"} className="nav-item">
                  Community
                </Link>
                <Link to={"#"} className="nav-item">
                  About
                </Link>
                <Link to={"/feedbackhub"} className="nav-item">
                  Support
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="header row">
          <div
            className="col-1 d-flex justify-content-center align-items-center"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            role="button"
            aria-label="Toggle navigation"
            style={{ cursor: "pointer" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
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
