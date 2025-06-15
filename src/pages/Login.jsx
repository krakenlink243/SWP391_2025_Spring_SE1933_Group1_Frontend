// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "./Login.css";
import { jwtDecode } from "jwt-decode";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  
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
    window.location.href = "/";
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username: username,
        password: password,
      });

      setMessage("Login successful!");

      // Added by Phan NT Son
      localStorage.setItem("token", res.data.token);
      let decodedToken = null;
      const token = localStorage.getItem("token");
      decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const role = decodedToken.role;
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      window.location.href = "/";

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
        "http://localhost:8080/api/public/oauth2/login",
        { email, name }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);
      setMessage("Google login successful!");
      // navigate('/')
    } catch (err) {
      console.error(err);
      setMessage("Google login failed");
    }
  };

  return (
    <div className="login-container">
      <main>
        <section class="form-section">
          <h1 class="form-title">Log in</h1>
          {message && <p>{message}</p>}
          <form onSubmit={handleLogin} class="form">
            <label htmlFor="username" class="form-label">
              Log in with username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              class="form-input"
              required
            />

            <label htmlFor="password" class="form-label password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              class="form-input"
              required
            />

            <div class="submit-container">
              <button type="submit" class="submit-button">
                Log in
              </button>

              <a href="http://localhost:8080/oauth2/authorization/google">
                <img src="/google-logo.jpg" alt="Google login" className="google-logo" />
              </a>

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
