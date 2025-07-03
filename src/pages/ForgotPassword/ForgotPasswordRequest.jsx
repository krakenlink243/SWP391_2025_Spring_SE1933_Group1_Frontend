import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const validateEmailFormat = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
function ForgotPasswordRequest() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateEmailFormat(email)) {
      setMessage("Invalid email format.");
      return;
    }

    try {
  
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/password/request`, {
        username,
        email,
      });

      alert("OTP sent successfully. Please check your email.");
      navigate("/reset-password", { state: { username, email } });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        setMessage("User or email not found.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <main className="support-form">
      <h1 className="form-title">Support</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="form-label username-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="form-label email-label">
            Confirm email address
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
        >
          Send
        </button>
        
      </form>
    </main>
  );
}

export default ForgotPasswordRequest;