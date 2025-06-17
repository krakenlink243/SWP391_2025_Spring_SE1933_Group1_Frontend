import { useState } from 'react';
import axios from 'axios';
import './WalletPage.css';
function WalletPage() {
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
                                    <strong>Current Wallet balance:</strong><h2>{balance}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WalletPage;