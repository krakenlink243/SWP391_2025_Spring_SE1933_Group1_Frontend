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
    const [isOpen, setIsOpen] = useState(false);
    const username = localStorage.getItem("username")
    const role = localStorage.getItem("role");
    const [showLogout, setShowLogout] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);


    const toggleOpenDropBox = () => {
        if (!isOpen) {
            setShowDropdown(true);
            setIsOpen(true);
        } else {
            setIsOpen(false);
            setTimeout(() => setShowDropdown(false), 300);
        }
    };

    return (
        <div className="user-menu">
            <div className="user-avatar" onClick={toggleOpenDropBox}>
                <span className="username">{username}</span>
                <i className="arrow-down" />
            </div>
            {showDropdown && (<div className={`dropdown ${isOpen ? "show" : "hide"}`}>
                <a href="/profile">View my profile</a>
                <a href="/account">Account details: <span style={{ color: "#4cb4ff" }}>{username}</span></a>
                <a href="/preferences">Store preferences</a>
                {role == 2 ? (<a href="/sendgame">Request Add Game</a>) : (<></>)}
                <a href="/transaction">Transaction</a>
                <a href="/wallet">View my wallet: </a>
                <a onClick={() => setShowLogout(true)}>Sign out of account…</a>
            </div>)}
            {showLogout && <Logout onClose={() => setShowLogout(false)} />}

        </div>

    );
}

export default UserDropBox;