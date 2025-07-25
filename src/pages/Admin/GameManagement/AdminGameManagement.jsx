import React from 'react'
import { useNavigate, useParams } from 'react-router';
import GameListed from './GameListed';
import GameHidden from './GameHidden';
import './AdminGameManagement.css'
function AdminGameManagement() {
    const { tab } = useParams();
    const navigate = useNavigate();
    const tabKeys = ['listed','hidden'];
    const curTab = tabKeys.indexOf(tab);
    const currentIndex = curTab === -1 ? 0 : curTab;
    const tabs = [
        <GameListed />,
        <GameHidden />
    ];
    const handleChangeTab = (indx) => {
        navigate(`/admin/game-management/${tabKeys[indx]}`);
    };
  return (
    <div className='admin-game-management-container'>
        <div className="admin-game-management-container-nav d-flex flex-row justify-content-center w-100 h-100 gap-3">
                <div
                    className={`nav-item${currentIndex === 0 ? " active" : ""}`}
                    onClick={() => handleChangeTab(0)}
                >
                    Listed Game
                </div>
                <div
                    className={`nav-item${currentIndex === 1 ? " active" : ""}`}
                    onClick={() => handleChangeTab(1)}
                >
                    Hidden Game
                </div>
            </div>
            <div className="admin-game-management-container-body">
                {tabs[currentIndex]}
            </div>
    </div>
  )
}

export default AdminGameManagement
