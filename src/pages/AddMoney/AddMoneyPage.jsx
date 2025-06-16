import { useState } from 'react';
import axios from 'axios';
import './AddMoneyPage.css';
function AddMoneyPage() {
    const userId = localStorage.getItem("userId");
    // const userMoney = localStorage.getItem("money");
    const amountArr = [75, 150, 375, 750, 1500];

    const addMoney = (amount) => {

        try {
            axios.post('http://localhost:8080/user/wallet/add', {
                userId: userId,
                amount: amount
            }).then(console.log("Success"));
        } catch (error) {
            alert("Added failed");
            console.log("Error: " + error);
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="spacer col-lg-2"></div>
                <div className="add-money-container col-lg-8">
                    <h1>ADD FUNDS TO YOUR STEAMCL WALLET</h1>
                    <div className="main-content">
                        <div className="left-col w-75">
                            <div className="items d-flex flex-colum gap-2 align-items-start">
                                {amountArr.map((am, idx) => (
                                    <div className='item'>
                                        <h2> Add {am * 1000}</h2>
                                        <div className="price-action">
                                            <div className="price">${am * 1000}</div>
                                            <div className="btn-add-money" onClick={addMoney}>
                                                <a className="btn-green-ui">
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
                                    <strong>Current Wallet balance:</strong><h2>User money</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}