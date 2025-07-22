import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";
import { useTranslation } from "react-i18next";



function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {t}=useTranslation();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage(t('Passwords do not match.'));
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/password/reset`, {
        username: state.username,
        otp,
        newPassword,
        confirmPassword,
      });

      alert(t('Password reset successfully. Redirecting to login...'));
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      alert(t('Invalid OTP or request failed.'));
    }
  };

  return (
    <main className="support-form">
      <h1 className="form-title">{t('Reset Password')}</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="otp" className="form-label username-label">
            {t('OTP Code')}
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="form-label username-label">
            {t('New Password')}
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label username-label">
            {t('Confirm Password')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="submit-button">{t('Reset')}</button>
        {message && <p className="form-status">{message}</p>}
      </form>
    </main>
  );
}

export default ResetPassword;
