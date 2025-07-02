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
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'username') {
      if (value.trim() === '') {
        setUsernameAvailable(null);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-username`, {
          params: { username: value },
        });
        setUsernameAvailable(res.data.available);
      } catch (error) {
        console.error("Username check failed", error);
        setUsernameAvailable(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (/\s/.test(formData.username)) {
      setMessage('Username must not contain spaces.');
      return;
    }

    if (usernameAvailable === false) {
      setMessage('Username is already taken.');
      return;
    }

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

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, fullData);
      setMessage('Registration successful!');
      console.log(response.data);

      navigate('/login', { state: { fromRegister: true } });

    } catch (error) {
      console.error(error);
      setMessage('Registration failed.');
    }
  };

  return (
    <div className="app-container">
      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="form-title">CREATE YOUR ACCOUNT</h1>
          {message && <p className="message">{message}</p>}
          
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
            {formData.username && usernameAvailable === false && (
              <p className="message-error">Username already taken.</p>
            )}
            {formData.username && usernameAvailable === true && (
              <p className="message-success">Username is available.</p>
            )}
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
    </div>
  );
};

export default RegisterDetails;
