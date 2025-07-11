// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "./Login.css";
import { useEffect } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    if (location.state?.fromRegister) {
      setMessage('Registration successful!');
      // Clear the message after a few seconds
      const timer = setTimeout(() => setMessage(''), 5000);
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        username: username,
        password: password,
      });

      setToken(res.data.token);

      return <Navigate to="/" replace />;

      // navigate('/');
      // Optionally redirect or store auth token here
    } catch (err) {
      console.error(err);
      setMessage("Invalid username or password");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);
    const email = decoded.email;
    const name = decoded.name;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/public/oauth2/login`,
        { email, name }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);
      alert("Google login successful!");
      navigate('/')
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="login-container">
      <main>
        <section className="form-section">
          <h1 className="form-title">Sign in</h1>
          <form onSubmit={handleLogin} className="form">
            {message && <p className="message">{message}</p>}
            <div className="form-item">
              <label htmlFor="username" className="form-label username">
                Sign in with username
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
            </div>

            <div className="form-item">
              <label htmlFor="password" className="form-label">
                Password
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
                Log in
              </button>
              <Link to={"/forgot-password"} className="forgot-password-link">
                Forgot password?
              </Link>

              <Link to={`${import.meta.env.VITE_API_URL}/oauth2/authorization/google`}>
                <img src="/google-logo.jpg" alt="Google login" className="google-logo" />
              </Link>

              {/* <div className="google-login">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setMessage("Google login failed")}
                  />
                </div> */}
              {/* <img
                  src="/google-logo.jpg"
                  alt="Google logo with red, yellow, green, and blue colors"
                  class="google-logo"
                  width="40"
                  height="40"
                /> */}
            </div>

          </form>
        </section>
      </main>
    </div>

  );
};

export default Login;
