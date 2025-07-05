import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="auth-container">
            {/* No Header/Nav/Footer */}
            <Outlet />
        </div>
    );
}
