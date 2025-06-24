import { useState, useEffect } from 'react';
import axios from 'axios';
import './WalletPage.css';
import { Navigate } from "react-router-dom";
import "../../services/notification";
import { createNotification } from '../../services/notification';

/**
 * @author Phan NT Son
 * @returns 
 */
function WalletPage() {
    const [balance, setBalance] = useState(0);
    const amountArr = [75, 150, 375, 750, 1500];
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to={"/"} replace />;
    }
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");



    /**
     * 
     * @param {*} amount of money to add to wallet
     */
    const addMoney = async (amount) => {
        await axios.post(`http://localhost:8080/user/wallet/add?amount=${amount}`)
            .then((response) => {
                getUserBalance();
                createNotification(userId, "Cart", "Add funds successfully to wallet");
            })
            .catch((error) => {
                alert("Add failed");
                console.log("Error: " + error);
            });
    };

    const getUserBalance = () => {
        axios.get(`http://localhost:8080/user/wallet`)
            .then((response) => setBalance(response.data))
            .catch(error => alert(error));
    };

    useEffect(() => {


        if (userId) {
            getUserBalance();
        }

    }, [balance]);



    return (

        <div className="add-money-container col-lg-8 text-white">
            <h2>Add funds to {username} wallet</h2>

            <div className="main-content d-flex flex-row">
                <div className="left-col w-75">
                    <div className="items d-flex flex-column gap-2 align-items-start w-100">
                        {amountArr.map((am, idx) => (
                            <div className='item d-flex flex-row justify-content-between w-100 p-3' key={idx}>
                                <h3> Add {(am * 1000).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h3>
                                <div className="price-action d-flex flex-row align-items-center gap-2">
                                    <div className="price">{(am * 1000).toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
                                    <div className="btn-add-money" onClick={() => addMoney(am * 1000)}>
                                        <a className="btn-green-ui p-2">
                                            <span>Add funds</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="right-col w-25">
                    <div className="right-content">
                        <h2>YOUR STEAMCL ACCOUNT</h2>
                        <div className="content-detail">
                            <strong>Current Wallet balance:</strong><h2>{balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalletPage;