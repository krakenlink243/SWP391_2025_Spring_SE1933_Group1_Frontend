import React, { useState } from "react";
import axios from "axios";
import "./EmailSettings.css";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";

const EmailSettings = ({ currentUser }) => {
  // State quản lý giao diện
  const [step, setStep] = useState(1);
  const {t}=useTranslation();
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
        `${import.meta.env.VITE_API_URL}/user/request-change`,
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
        `${import.meta.env.VITE_API_URL}/user/confirm-change`,
        {
          newEmail,
          token: verificationCode,
        }
      );
      setMessage(response.data.message);
      alert(
        t("Email updated successfully! Please log in again to see the changes.")
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
    <div className="change-email-container container-fluid py-5">
      <div className="row">
        <div className="spacer col-lg-2"></div>
        <div className="main-content col-lg-8">
          <div className="settings-section">
            <h2>{t('Contact Info')}</h2>
            <p className="section-description">
              {t(`Manage your account's email address.`)}
            </p>
          </div>

          <div className="current-email-display">
            <p>
              <strong>{t('Current Email')}:</strong> {currentUser?.email}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handleRequestChange} className="d-flex flex-column gap-3">
              <h3 className="changeEmail">{t('Change Email Address')}</h3>
              <div className="form-group d-flex flex-column">
                <label htmlFor="newEmail" className="form-label">{t('New Email Address')}</label>
                <input
                  type="email"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={t("Enter your new email")}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                {/* <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Sending..." : "Request Change"}
                </button> */}
                <Button type={t("submit")} disabled={loading} label={loading ? t("Sending...") : t("Request Change")} color="gradient-blue-button" />
              </div>

            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleConfirmChange} className="d-flex flex-column gap-4">
              <h3>{t('Enter Verification Code')}</h3>
              <p className="section-description">
                {t('A code has been sent to')} <strong>{currentUser?.email}</strong>.
                {t('Please enter it below.')}
              </p>
              <div className="form-group">
                <label htmlFor="verificationCode" className="form-label">{t('Verification Code')}</label>
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder={t("6-digit code")}
                  required
                  className="form-input"

                />
                {message && <div className="feedback-success">{message}</div>}

              </div>

              <div className="form-actions d-flex flex-row justify-content-around">
                <Button type={"submit"} disabled={loading} color="gradient-blue-button" label={loading ? t("Verifying...") : t("Confirm Change")} />
                <Button
                  type={"button"}
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setMessage("");
                  }}
                  color="white-grey-button"
                  label={t("Cancel")}
                />
              </div>
            </form>
          )}

          {error && <p className="feedback-error">{error}</p>}
        </div>
        <div className="spacer col-lg-2"></div>
      </div>

    </div>
  );
};

export default EmailSettings;
