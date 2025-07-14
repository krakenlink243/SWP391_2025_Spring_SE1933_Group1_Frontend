import { useState, useEffect } from "react";
import "./UserDropBox.css";
import Logout from "../Logout/Logout";
import { Link } from "react-router-dom";

/**
 * @author Phan NT Son
 * @description Component to display a list of actions
 * @param {*} param0
 * @returns
 */
function UserDropBox({ userBalance }) {
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="user-drop-box-menu dropdown">
      <div
        className="user-drop-box-avatar dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        <span className="user-drop-box-name">{username}</span>
      </div>
      <div className="dropdown-menu">
        <Link className="dropdown-item" to="/profile">
          View my profile
        </Link>
        <Link className="dropdown-item" to="/account">
          Account details: <span className="item-username" >{username}</span>
        </Link>
        <Link className="dropdown-item" to="/library">
          Library
        </Link>
        {role == 'Publisher' ? (
          <Link className="dropdown-item" to="/sendgame">
            Request Add Game
          </Link>
        ) : null}
        {role == 'Standard' ? (
          <Link className="dropdown-item" to="/sendpublisher">
            Request Publisher
          </Link>
        ) : null}
        <Link className="dropdown-item" to="/account/wallet">
          View my wallet:{" "}
          <span style={{ color: "#4cb4ff" }}>
            {userBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </Link>
        <span
          className="dropdown-item"
          style={{ cursor: "pointer" }}
          onClick={() => setShowLogout(true)}
        >
          Sign out of account…
        </span>
      </div>
      {showLogout && <Logout onClose={() => setShowLogout(false)} />}
    </div>
  );
}

export default UserDropBox;
