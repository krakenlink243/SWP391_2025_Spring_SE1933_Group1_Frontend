import "./RegisterEmail.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const RegisterEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {t}=useTranslation();
  const validateEmailFormat = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateEmailFormat(email)) {
      setMessage(t("Invalid email format."));
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `swp3912025springse1933group1backend-productionnewgen.up.railway.app/api/auth/check-email`,
        {
          params: { email },
        }
      );

      if (!res.data.available) {
        setMessage(t("Email already in use."));
        return;
      }
      await axios.post(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/api/auth/send-verification-otp`, { email });
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      console.error(err);
      setMessage(t("Error checking email."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container container-fluid py-5">
      <div className="row">
        <div className="spacer col-lg-3"></div>
        <div className="main-content col-lg-6">
          <form className="form" onSubmit={handleSubmit}>
            <h1 className="form-title">{t('CREATE YOUR ACCOUNT')}</h1>
            {message && <p className="message">{message}</p>}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t('Email address')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <label htmlFor="age" className="checkbox-group">
              <input
                id="age"
                type="checkbox"
                className="checkbox-input"
                required
              />
              <span>
                {t(`I'm 13 years old or older and agree with Centurion`)} <Link to={`/terms-of-use`} >{t('Terms of use')}</Link>
                {" "}and <Link to={`/privacy-policy`}>{t('Privacy policy')}</Link>.
              </span>
            </label>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? t("Checking...") : t("Continue")}
            </button>
          </form>

        </div>
        <div className="spacer col-lg-3"></div>
      </div>

    </div>
  );
};

export default RegisterEmail;
