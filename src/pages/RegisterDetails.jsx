import './RegisterDetails.css';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    country: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const fullData = {
        email,
        username: formData.username,
        password: formData.password,
        country: formData.country,
      };

      const response = await axios.post('http://localhost:8080/api/auth/register', fullData);
      setMessage('Registration successful!');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage('Registration failed.');
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

          <div className="form-group">
            <label className="form-label" htmlFor="username">Steam Account Name</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Choose Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              className="form-select"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select a country</option>
              <option value="Vietnam">Vietnam</option>
              <option value="United States">United States</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Continue
          </button>
        </form>
      </main>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RegisterDetails;
