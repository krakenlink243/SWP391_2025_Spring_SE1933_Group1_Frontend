import { useState } from "react";
import "./Logout.css";
/**
 * @author Phan NT Son
 * @returns 
 */
function Logout({onClose}) {

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="logout-overlay">
            <div className="logout-modal">
                <h1>Do you want to logout?</h1>
                <div className="logout-buttons">
                    <button onClick={onClose}>
                        <p><u>Cancel</u></p>
                    </button>
                    <button onClick={handleLogout}>
                        <p>Logout</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Logout;