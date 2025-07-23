import './RegisterDetails.css';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const RegisterDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const { t } = useTranslation();
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

    // Validate username length
    if (formData.username.length < 2) {
      setMessage(t('Username must be at least 2 characters long.'));
      return;
    }

    // Validate username: no special characters
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setMessage(t('Username must not contain special characters.'));
      return;
    }

    // Username should not contain whitespace (you already had this)
    if (/\s/.test(formData.username)) {
      setMessage(t('Username must not contain spaces.'));
      return;
    }

    // Username availability check
    if (usernameAvailable === false) {
      setMessage(t('Username is already taken.'));
      return;
    }

    // Validate password complexity
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(formData.password)) {
      setMessage(
        t(
          'Password must be at least 8 characters long and include a lowercase letter, an uppercase letter, a number, and a special character.'
        )
      );
      return;
    }

    // Password match check
    if (formData.password !== formData.confirmPassword) {
      setMessage(t('Passwords do not match.'));
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
      setMessage(t('Registration failed.'));
    }
  };

  return (
    <div className="register-detail-container container-fluid py-5">
      <div className='row'>
        <div className='spacer col-lg-3'></div>
        <div className='main-content col-lg-6 p-3'>
          <form className="form" onSubmit={handleSubmit}>
            <h1 className="form-title">{t('Create Your Account')}</h1>
            {message && <p className="message">{message}</p>}

            <div className="form-group">
              <label className="form-label" htmlFor="username">{t('Centurion Account Name')}</label>
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
                <p className="message-error">{t('Username already taken.')}</p>
              )}
              {formData.username && usernameAvailable === true && (
                <p className="message-success">{t('Username is available.')}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">{t("Choose Password")}</label>
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
              <label className="form-label" htmlFor="confirmPassword">{t('Confirm Password')}</label>
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
              <label className="form-label" htmlFor="country">{t('Country')}</label>
              <select
                id="country"
                name="country"
                className="form-select custom-select-arrow"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">{t('Select a country')}</option>
                <option value="Vietnam">{t('Vietnam')}</option>
                <option value="United States">{t('United States')}</option>
              </select>
            </div>

            <div className='w-100 d-flex justify-content-center'>
              <button type="submit" className="submit-button">
                {t('Continue')}
              </button>
            </div>
          </form>
        </div>
        <div className='spacer col-lg-3'></div>
      </div>

    </div>
  );
};

export default RegisterDetails;
