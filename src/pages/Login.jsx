// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "./Login.css";
import jwt_decode from "jwt-decode";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username: username,
        password: password,
      });

      setMessage("Login successful!");
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
    <GoogleOAuthProvider clientId="439938595818-5hsn4krnatjq8p26372l98jekoh9ov0i.apps.googleusercontent.com">
      <div className="login-container">
        <main>
          <section class="form-section">
            <h1 class="form-title">Log in</h1>
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
              {message && <p>{message}</p>}
            </form>
          </section>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
