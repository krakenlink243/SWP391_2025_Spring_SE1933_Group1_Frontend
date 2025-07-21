import React from 'react'
import GamePending from './GamePending';
import GameApproved from './GameApproved';
import GameDeclined from './GameDeclined';

import { useNavigate, useParams } from 'react-router';
import './GameManagement.css'
function GameManagement() {
    const { tab } = useParams();
    const navigate = useNavigate();
    const tabKeys = ['approved','pending','declined'];
    const curTab = tabKeys.indexOf(tab);
    const currentIndex = curTab === -1 ? 0 : curTab;
    const tabs = [
        <GameApproved />,
        <GamePending />,
        <GameDeclined />
    ];
    const handleChangeTab = (indx) => {
        navigate(`/publisher/game-management/${tabKeys[indx]}`);
    };
  return (
    <div className='game-management-container'>
        <div className="game-management-container-nav d-flex flex-row justify-content-center w-100 h-100 gap-3">
                <div
                    className={`nav-item${currentIndex === 0 ? " active" : ""}`}
                    onClick={() => handleChangeTab(0)}
                >
                    Approved
                </div>
                <div
                    className={`nav-item${currentIndex === 1 ? " active" : ""}`}
                    onClick={() => handleChangeTab(1)}
                >
                    Pending
                </div>
                <div
                    className={`nav-item${currentIndex === 2 ? " active" : ""}`}
                    onClick={() => handleChangeTab(2)}
                >
                    Declined
                </div>
            </div>
            <div className="game-management-container-body">
                {tabs[currentIndex]}
            </div>
    </div>
  )
}

export default GameManagement
