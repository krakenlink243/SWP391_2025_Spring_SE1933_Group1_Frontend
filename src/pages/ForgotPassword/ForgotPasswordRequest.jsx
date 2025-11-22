import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ForgotPasswordRequest.css";

const validateEmailFormat = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
function ForgotPasswordRequest() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    if (!validateEmailFormat(email)) {
      setMessage("Invalid email format.");
      return;
    }

    try {
      const response = await axios.post(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/api/password/request`, {
        email,
      });

      alert(t('OTP sent successfully. Please check your email.'));
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        setMessage(t('User or email not found.'));
      } else {
        setMessage(t('Something went wrong. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="support-form">
      <h1 className="form-title">{t('Support')}</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        {/* <div>
          <label htmlFor="username" className="form-label username-label">
            {t('Username')}
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
        </div> */}
        <div>
          <label htmlFor="email" className="form-label email-label">
            {t('Confirm email address')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? t("Sending...") : t("Send")}
        </button>

      </form>
    </main>
  );
}

export default ForgotPasswordRequest;