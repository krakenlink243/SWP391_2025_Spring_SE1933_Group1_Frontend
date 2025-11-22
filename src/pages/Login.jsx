// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "./Login.css";
import { useEffect } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ content: "", type: "" });
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (location.state?.fromRegister) {
      setMessage({
        content: t('Registration successful!'),
        type: "success"
      });
      // Clear the message after a few seconds
      const timer = setTimeout(() => setMessage({ content: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Added by Phan NT Son
  if (localStorage.getItem("token")) {
    return <Navigate to={"/"} replace />
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/api/auth/login`, {
        username: username,
        password: password,
      });

      setToken(res.data.token);

      return <Navigate to="/" replace />;

    } catch (err) {
      console.error(err);
      setMessage({
        content: t("Invalid username or password"),
        type: "error",
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const email = decoded.email;
    const name = decoded.name;

    try {
      const response = await axios.post(
        `swp3912025springse1933group1backend-productionnewgen.up.railway.app/api/public/oauth2/login`,
        { email, name }
      );

      setToken(response.data.token);
      alert(t("Google login successful!"));
      navigate('/')
    } catch (err) {
      console.error(err);
      alert(t("Google login failed"));
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="login-container">
        <main>
          <section className="form-section">
            <form onSubmit={handleLogin} className="form">
              <h1 className="form-title">{t('Sign in')}</h1>
              <div className="form-item">
                <label htmlFor="username" className="form-label username">
                  {t('Sign in with username')}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  required
                />
                {message && <div className={`message ${message.type === "success" ? "success-message" : "error-message"}`}>{message.content}</div>}

              </div>

              <div className="form-item">
                <label htmlFor="password" className="form-label">
                  {t('Password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="submit-container">
                <button type="submit" className="submit-button">
                  {t('Log in')}
                </button>
                <Link to={"/forgot-password"} className="forgot-password-link">
                  {t('Forgot password?')}
                </Link>
                <GoogleLogin onSuccess={handleGoogleSuccess}/>
              </div>

            </form>
          </section>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
