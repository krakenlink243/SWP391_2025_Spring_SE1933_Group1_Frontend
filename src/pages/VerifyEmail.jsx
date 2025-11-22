import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerifyEmail.css';
import { useTranslation } from 'react-i18next';
import { useTransition } from 'react';
/**
 * @author Loc Phan
 */

const VerifyEmailOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;
  const {t}=useTranslation();
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register');
      alert(t('Email is required to verify. Please register first.'));
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setMessage(t('OTP must be a 6-digit number.'));
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        email,
        otp,
      });

      navigate('/register-details', { state: { email } });
    } catch (err) {
      console.error(err);
      setMessage(t('Invalid or expired OTP.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='verify-container container-fluid py-5 h-100'>
      <div className='row'>
        <div className='spacer col-lg-3'></div>
        <div className='main-content col-lg-6 h-100'>
          <h1 className="verify-title">{t('Verify Your Email')}</h1>
          <form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center align-items-start'>
            {message && (<p className="message-text">{message}</p>)}
            <label htmlFor="otp" className="otp-label">
              {t('OTP Code')}
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="otp-input"
              required
            />
            <button type="submit" className="submit-button">
              {t('Verify')}
            </button>
          </form>

        </div>
        <div className='spacer col-lg-3'></div>
      </div>


    </main>
  );
};

export default VerifyEmailOtp;
