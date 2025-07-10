import "./RegisterEmail.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmailFormat = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateEmailFormat(email)) {
      setMessage("Invalid email format.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/check-email`,
        {
          params: { email },
        }
      );

      if (!res.data.available) {
        setMessage("Email already in use.");
        return;
      }
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-verification-otp`, { email });
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      console.error(err);
      setMessage("Error checking email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* <header className="header">
          <div className="logo"></div>
          <div className="brand">STEAMCL</div>
          <nav className="nav">
            <a href="#" className="nav-link active">STORE</a>
            <a href="#" className="nav-link">COMMUNITY</a>
            <a href="#" className="nav-link">ABOUT</a>
            <a href="#" className="nav-link">SUPPORT</a>
          </nav>
      </header> */}
      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="form-title">CREATE YOUR ACCOUNT</h1>
          {message && <p className="message">{message}</p>}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Email address"
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
              I'm 13 years old or older and agree with policies and SteamCL
              security policy
            </span>
          </label>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>
      </main>

    </div>
  );
};

export default RegisterEmail;
