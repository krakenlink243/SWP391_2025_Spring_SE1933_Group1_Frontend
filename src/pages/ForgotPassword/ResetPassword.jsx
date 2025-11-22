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
  const validateStrongPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateStrongPassword(newPassword)) {
      setMessage(t('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage(t('Passwords do not match.'));
      return;
    }

    try {
      const response = await axios.post(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/api/password/reset`, {
        email: state.email,
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
      {message && <p className="form-status" style={{ color: 'red' }}>{message}</p>}
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
        
      </form>
    </main>
  );
}

export default ResetPassword;
