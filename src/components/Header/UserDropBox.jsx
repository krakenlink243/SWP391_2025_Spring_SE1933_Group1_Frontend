import { useState, useEffect } from "react";
import "./UserDropBox.css";
import Logout from "../Logout/Logout";

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
        <a className="dropdown-item" href="/profile">
          View my profile
        </a>
        <a className="dropdown-item" href="/account">
          Account details: <span style={{ color: "#4cb4ff" }}>{username}</span>
        </a>
        <a className="dropdown-item" href="/library">
          Library
        </a>
        {role == 'Publisher' ? <a href="/sendgame">Request Add Game</a> : <></>}
        {role == 'Standard' ? <a href="/sendpublisher">Request Publisher</a> : <></>}
        <a className="dropdown-item" href="/account/wallet">
          View my wallet:{" "}
          <span style={{ color: "#4cb4ff" }}>
            {userBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </a>
        <a className="dropdown-item" onClick={() => setShowLogout(true)}>
          Sign out of account…
        </a>
      </div>
      {showLogout && <Logout onClose={() => setShowLogout(false)} />}
    </div>
  );
}

export default UserDropBox;
