import React from "react";
import { useState } from "react";
import "../components/Header/Header.css"; // Or use CSS Modules: import styles from './Header.module.css';
import "./AdminHeader.css";
import Button from "../components/Button/Button";
import Logout from "../components/Logout";
import { useTranslation } from "react-i18next";
import "../i18n";

/**
 * @author Phan NT Son
 * @param {*} param0 
 * @returns 
 */
const AdminHeader = ({ currentTab, changeToTab }) => {
    const [showLogout, setShowLogout] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleBackToStore = () => {
        window.location.href = '/';
    };

    return (
        <header className="steam-header">
            {" "}
            <a href="/">
                <img src="/logo_steam.svg" alt="Steam Logo" className="logo" />
            </a>
            <nav className="user-actions">
                <a className={currentTab === "Request Management" ? "active" : ""} onClick={() => changeToTab("Request Management")}>REQUEST MANAGEMENT</a>
                <a className={currentTab === "User Management" ? "active" : ""} onClick={() => changeToTab("User Management")}>USER</a>
            </nav>
            <div className="user-actions">
                <Button label={"Back to Store"} color={'blue-button'} onClick={handleBackToStore} />
                <Button label={t("logout")} color={'blue-button'} onClick={() => setShowLogout(true)} />
                {showLogout && <Logout onClose={() => setShowLogout(false)} />}
                <button onClick={() => changeLanguage("vi")}>Tiếng Việt</button>
                <button onClick={() => changeLanguage("en")}>English</button>
            </div>
        </header>
    );
};

export default AdminHeader;
