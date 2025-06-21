import React from "react";
import { useState, forwardRef, useEffect } from "react";
import "../../components/Header/Header.css"; // Or use CSS Modules: import styles from './Header.module.css';
import "./AdminHeader.css";
import NotificationBox from "../../components/Notifications/NotificationBox";
import UserDropBox from "../../components/Header/UserDropBox";
import { useTranslation } from "react-i18next";
import "../../i18n";
import axios from "axios";

/**
 * @author Phan NT Son
 * @param {*} param0 
 * @returns 
 */
const AdminHeader = forwardRef(({ currentTab, changeToTab }, ref) => {
    const [showLogout, setShowLogout] = useState(false);
    const { t, i18n } = useTranslation();
    const section = [2, 2, 4, 3, 1]

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const [balance, setBalance] = useState(0);
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const getUserBalance = () => {
            axios.get(`http://localhost:8080/users/${userId}/balance`)
                .then((response) => setBalance(response.data))
                .catch(error => alert(error));
        };
        if (userId) {
            getUserBalance();
        }
    }, []);


    return (
        <div className="container-fluid" ref={ref}>
            <div className="header row">
                <div className={`col-lg-${section[0]}`}></div>
                <div className={`header-logo col-lg-${section[1]} align-content-center`}>
                    <a href="/"><img src="/logo_steam.svg" alt="Steam Logo" className="logo w-100" /></a>
                </div>
                <div className={`header-nav col-lg-${section[2]}`}>
                    <a className={currentTab === "Request Management" ? "active" : ""} onClick={() => changeToTab("Request Management")}>REQUEST MANAGEMENT</a>
                    <a className={currentTab === "User Management" ? "active" : ""} onClick={() => changeToTab("User Management")}>USER</a>
                </div>
                <div className={`header-user-action col-lg-${section[3]}`}>
                    <div className="header-user-action-content d-flex flex-column align-items-end w-75 p-2">
                        <div className="user-action-content">
                            <a href="/cart" className="w-25 px-2">Cart</a>
                            <div className="w-25 px-2">
                                <NotificationBox />
                            </div>
                            <div className="w-50 px-2">
                                <UserDropBox
                                    userBalance={balance}
                                />
                            </div>

                        </div>
                        <div className="user-wallet w-50">
                            <p>Money hehe</p>
                        </div>
                    </div>
                    <div className="header-user-action-icon w-25">
                        <p className="">Icon</p>
                    </div>

                </div>
                <div className={`col-lg-${section[4]}`}></div>

            </div>

        </div>
    );
});

export default AdminHeader;
