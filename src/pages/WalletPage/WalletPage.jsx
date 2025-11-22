import { useState, useEffect } from "react";
import axios from "axios";
import "./WalletPage.css";
import { Navigate, useNavigate } from "react-router-dom";
import "../../services/notification";
import { useTranslation } from "react-i18next";

/**
 * @author Phan NT Son
 * @returns
 */
function WalletPage() {
  const amountArr = [50, 100, 200, 350, 500];
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const {t} = useTranslation();
  if (!token) {
    return <Navigate to={"/"} replace />;
  }
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  const [balance, setBalance] = useState(0);

  /**
   *
   * @param {*} amount of money to add to wallet
   */
  const addMoney = async (amount) => {
    if (amount <= 0) {
      alert(t('Please enter a valid amount.'));
      return;
    }
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/payments/create-vnpay-payment?amount=${amount}`
      );
      const { paymentUrl } = response.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("Failed to create payment URL:", error);
      alert(t('Error creating payment link. Please try again.'));
    }
  };

  const getUserBalance = () => {
    axios
      .get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/user/wallet`)
      .then((response) => setBalance(response.data))
      .catch((error) => alert(error));
  };

  useEffect(() => {
    if (userId) {
      getUserBalance();
    }
  }, [balance]);

  return (
    <div className="add-money-container col-lg-8 text-white">
      <h2>{t('Add funds to wallet', {userName: username})}</h2>

      <div className="main-content d-flex flex-row">
        <div className="left-col w-75">
          <div className="items d-flex flex-column gap-2 align-items-start w-100">
            {amountArr.map((am, idx) => (
              <div
                className="item d-flex flex-row justify-content-between w-100 p-3"
                key={idx}
              >
                <h3>
                  {" "}
                  {t('Add')}{" "}
                  {am.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </h3>
                <div className="price-action d-flex flex-row align-items-center gap-2">
                  <div className="price">
                    {am.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </div>
                  <div className="btn-add-money" onClick={() => addMoney(am)}>
                    <a className="btn-green-ui p-2">
                      <span>{t('Add funds')}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="right-col w-25">
          <div className="right-content">
            <h2>{t('YOUR CENTURION ACCOUNT')}</h2>
            <div className="content-detail">
              <strong>{t('Current Wallet balance')}:</strong>
              <h2>
                {balance.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
