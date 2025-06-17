import { useState, useEffect } from 'react';
import axios from 'axios';
import './WalletPage.css';
function WalletPage() {
    const userId = localStorage.getItem("userId");
    // const userMoney = localStorage.getItem("money");
    const amountArr = [75, 150, 375, 750, 1500];
    const username = localStorage.getItem("username");
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
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            axios.get("http://localhost:8080/users")
                .then(res => {
                    const users = res.data.data || [];
                    const user = users.find(u => u.userId === Number(userId));
                    setBalance(user?.walletBalance || 0);
                })
                .catch(() => setBalance(0));
        }
    }, []);

    return (

        <div className="add-money-container col-lg-8 text-white">
            {/* <h1>ADD FUNDS TO YOUR STEAMCL WALLET</h1> */}
            <h2>Add funds to {username} wallet</h2>

            <div className="main-content d-flex flex-row">
                <div className="left-col w-75">
                    <div className="items d-flex flex-column gap-2 align-items-start w-100">
                        {amountArr.map((am, idx) => (
                            <div className='item d-flex flex-row justify-content-between w-100 p-3'>
                                <h3> Add {(am * 1000).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h3>
                                <div className="price-action d-flex flex-row align-items-center gap-2">
                                    <div className="price">{(am * 1000).toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
                                    <div className="btn-add-money" onClick={addMoney}>
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
                            <strong>Current Wallet balance:</strong><h2>{balance}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalletPage;