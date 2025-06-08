import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // optional styling

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      console.log('Login successful:', response.data);
      setMessage('Login successful!');
      // handle storing token, redirecting, etc.
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Invalid username or password.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>

      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p className="message">{message}</p>

      <hr />

      <button className="google-login-button" onClick={handleGoogleLogin}>
        Continue with Google
      </button>
    </div>
  );
};

export default Login;
