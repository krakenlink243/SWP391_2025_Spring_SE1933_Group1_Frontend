import React from 'react'
import { useNavigate, useParams } from 'react-router';
import ActiveUser from './ActiveUser';
import BannedUser from './BannedUser';
import './UserManagement.css'
function UserManagement() {
    const { tab } = useParams();
    const navigate = useNavigate();
    const tabKeys = ['active','banned'];
    const curTab = tabKeys.indexOf(tab);
    const currentIndex = curTab === -1 ? 0 : curTab;
    const tabs = [
        <ActiveUser />,
        <BannedUser />
    ];
    const handleChangeTab = (indx) => {
        navigate(`/admin/user-management/${tabKeys[indx]}`);
    };
  return (
    <div className='user-management-container'>
        <div className="user-management-container-nav d-flex flex-row justify-content-center w-100 h-100 gap-3">
                <div
                    className={`nav-item${currentIndex === 0 ? " active" : ""}`}
                    onClick={() => handleChangeTab(0)}
                >
                    Active User
                </div>
                <div
                    className={`nav-item${currentIndex === 1 ? " active" : ""}`}
                    onClick={() => handleChangeTab(1)}
                >
                    Banned User
                </div>
            </div>
            <div className="user-management-container-body">
                {tabs[currentIndex]}
            </div>
    </div>
  )
}

export default UserManagement
