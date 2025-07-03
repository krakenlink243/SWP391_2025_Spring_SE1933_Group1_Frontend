import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerifyEmail.css';
/**
 * @author Loc Phan
 */

const VerifyEmailOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register');
      alert('Email is required to verify. Please register first.');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setMessage('OTP must be a 6-digit number.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/verify-otp', {
        email,
        otp,
      });

      navigate('/register-details', { state: { email } });
    } catch (err) {
      console.error(err);
      setMessage('Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1 className="verify-title">Verify Your Email</h1>
      <form onSubmit={handleSubmit}>
      {message && (<p className="message-text">{message}</p>)}
        <label htmlFor="otp" className="otp-label">
          OTP Code
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
          Verify
        </button>
      </form>
      
    </main>
  );
};

export default VerifyEmailOtp;
