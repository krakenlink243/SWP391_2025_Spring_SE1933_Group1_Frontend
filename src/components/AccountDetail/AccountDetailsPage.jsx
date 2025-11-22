import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountDetailsPage.css";
import { useNavigate, Link } from "react-router-dom";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";

const AccountDetailsPage = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const {t}=useTranslation();
  // === STATE CHO MODAL NẠP TIỀN (BẰNG USD) ===
  const [amountUsd, setAmountUsd] = useState(5); // Số tiền nạp mặc định là $5
  const [bankCode, setBankCode] = useState("");
  const [language, setLanguage] = useState("vn");

  useEffect(() => {
    // Gọi API để lấy thông tin tài khoản
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/user/profile/${userId}`)
        .then((res) => setAccount(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleAddFunds = async () => {
    if (amountUsd < 5) {
      // Giới hạn số tiền nạp tối thiểu là $5
      alert(t("Minimum funding amount is $5."));
      return;
    }
    try {
      // Xây dựng các tham số cho request
      const params = {
        amount: amountUsd,
        language: language,
      };
      if (bankCode) {
        params.bankCode = bankCode;
      }

      const response = await axios.post(
        `swp3912025springse1933group1backend-productionnewgen.up.railway.app/api/v1/payments/create-vnpay-payment`,
        null,
        { params: params }
      );

      const { paymentUrl } = response.data;
      if (paymentUrl) {
        // navigate(paymentUrl); // Chuyển hướng đến cổng thanh toán
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("Failed to create payment URL:", error);
      alert(t("Error creating payment link. Please try again."));
    }
  };

  if (loading) return <div>{t('Loading account details...')}</div>;

  const handleOpenModal = (cond) => {
    if (cond) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "auto"

    setIsModalOpen(cond);
  }

  return (
    <div className="account-details-page container-fluid py-5">
      <div className="row">
        <div className="spacer col-lg-1"></div>
        <div className="main-content col-lg-10">
          <div className="account-main-content">
            <aside className="account-sidebar">
              <Link to="#" className="active">
                {t('Account details')}
              </Link>
              <Link to="#">{t('Store preferences')}</Link>
            </aside>

            <main className="account-info-panel">
              <h1>{t(`'s Account`, {userName: account.username})}</h1>
              <section className="info-section purchase-history">
                <h3>{t('STORE & TRANSACTIONS HISTORY')}</h3>
                <div className="wallet-balance">
                  <span>{t('Wallet Balance')}</span>
                  <strong>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD", // Hiển thị số dư bằng USD
                    }).format(account?.walletBalance || 0)}
                  </strong>
                </div>
                <div className="action-links">
                  <button
                    onClick={() => handleOpenModal(true)}
                    className="action-btn"
                  >
                    {t('Add funds to your Wallet')}
                  </button>
                  <Link to="/account/history">{t('View transactions history')}</Link>
                </div>
              </section>
              <section className="info-section contact-info">
                <h3>{t('CONTACT INFO')}</h3>
                <p>{t('Email address')}: {account?.email}</p>
                <Link to="/change-email">{t('Manage email preferences')}</Link>
                <br />
                <Link to="/change-password">{t('Change password')}</Link>
              </section>
            </main>
          </div>

          {/* MODAL NẠP TIỀN (LÀM VIỆC VỚI USD) */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>{t('Add Funds to Your Steam Wallet')}</h2>
                <div className="amount-options">
                  <button onClick={() => setAmountUsd(5)}>$5.00</button>
                  <button onClick={() => setAmountUsd(10)}>$10.00</button>
                  <button onClick={() => setAmountUsd(25)}>$25.00</button>
                  <button onClick={() => setAmountUsd(50)}>$50.00</button>
                  <button onClick={() => setAmountUsd(100)}>$100.00</button>
                </div>

                <input
                  type="number"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  placeholder="Or enter an amount (USD)"
                  min="5" // Đặt giá trị tối thiểu
                />

                <div className="form-group-modal">
                  <label htmlFor="bankCode">{t('Bank (Optional)')}</label>
                  <select
                    id="bankCode"
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                  >
                    <option value="">{t('Select a bank...')}</option>
                    <option value="NCB">{t('NCB (Recommended)')}</option>
                    <option value="VNBANK">{t('Ngân hàng Nội địa')}</option>
                    <option value="VnPayQR">VNPAYQR</option>
                    <option value="VISA">VISA</option>
                  </select>
                </div>

                <div className="form-actions d-flex flex-row justify-content-around">
                  {/* <button onClick={handleAddFunds} className="action-btn primary">
                    Add Funds
                  </button>
                  <button
                    onClick={() => handleOpenModal(false)}
                    className="action-btn secondary"
                  >
                    Cancel
                  </button> */}
                  <Button label={t(`Add funds`)} onClick={handleAddFunds} color="gradient-green-button" />
                  <Button label={t(`Cancel`)} onClick={() => handleOpenModal(false)} color="grey-button" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="spacer col-lg-1"></div>
      </div>

    </div>
  );
};

export default AccountDetailsPage;
