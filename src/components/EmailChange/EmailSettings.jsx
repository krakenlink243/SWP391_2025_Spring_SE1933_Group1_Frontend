import React, { useState } from "react";
import axios from "axios";
import "./EmailSettings.css";

const EmailSettings = ({ currentUser }) => {
  // State quản lý giao diện
  const [step, setStep] = useState(1);

  // State cho các giá trị trong form
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // State cho loading và thông báo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Hàm xử lý yêu cầu thay đổi email (Bước 1)
  const handleRequestChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // SỬA LẠI: Thêm http:// và đường dẫn API đầy đủ
      const response = await axios.post(
        "http://localhost:8080/user/request-change",
        { newEmail }
      );
      setMessage(response.data.message);
      setStep(2); // Chuyển sang bước 2 để nhập mã
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xác nhận thay đổi email (Bước 2)
  const handleConfirmChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // SỬA LẠI: Thêm http:// và đường dẫn API đầy đủ
      const response = await axios.post(
        "http://localhost:8080/user/confirm-change",
        {
          newEmail,
          token: verificationCode,
        }
      );
      setMessage(response.data.message);
      alert(
        "Email updated successfully! Please log in again to see the changes."
      );
      // Hoặc chuyển hướng
      // window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.error || "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="settings-section">
        <h2>Contact Info</h2>
        <p className="section-description">
          Manage your account's email address.
        </p>
      </div>

      <div className="current-email-display">
        <p>
          <strong>Current Email:</strong> {currentUser?.email}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleRequestChange}>
          <h3>Change Email Address</h3>
          <div className="form-group">
            <label htmlFor="newEmail">New Email Address</label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter your new email"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Sending..." : "Request Change"}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleConfirmChange}>
          <h3>Enter Verification Code</h3>
          <p className="section-description">
            A code has been sent to <strong>{currentUser?.email}</strong>.
            Please enter it below.
          </p>
          <div className="form-group">
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="6-digit code"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Verifying..." : "Confirm Change"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError("");
                setMessage("");
              }}
              className="cancel-btn"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {error && <p className="feedback-error">{error}</p>}
      {message && <p className="feedback-success">{message}</p>}
    </div>
  );
};

export default EmailSettings;
