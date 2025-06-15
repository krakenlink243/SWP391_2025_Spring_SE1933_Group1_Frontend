import { useState } from "react";
import './UserDropBox.css';
import Logout from "../Logout/Logout";


/**
 * @author Phan NT Son
 * @description Component to display a list of actions
 * @param {*} param0 
 * @returns 
 */
function UserDropBox() {
    const username = localStorage.getItem("username")
    const role = localStorage.getItem("role");
    const [showLogout, setShowLogout] = useState(false);


    return (
        <div className="user-menu dropdown">
            <div className="user-avatar dropdown-toggle" data-bs-toggle="dropdown">
                <span className="username">{username}</span>
            </div>
            <div className="dropdown-menu">
                <a className="dropdown-item" href="/profile">View my profile</a>
                <a className="dropdown-item" href="/account">Account details: <span style={{ color: "#4cb4ff" }}>{username}</span></a>
                <a className="dropdown-item" href="/preferences">Store preferences</a>
                {role == 2 ? (<a href="/sendgame">Request Add Game</a>) : (<></>)}
                <a className="dropdown-item" href="/transaction">Transaction</a>
                <a className="dropdown-item" href="/wallet">View my wallet: </a>
                <a className="dropdown-item" onClick={() => setShowLogout(true)}>Sign out of account…</a>
            </div>
            {showLogout && <Logout onClose={() => setShowLogout(false)} />}
        </div>

    );
}

export default UserDropBox;