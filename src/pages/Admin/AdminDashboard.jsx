import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import LoginChart from '../../components/LoginChart/LoginChart';

function AdminDashboard({ tab }) {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const [mode, setMode] = useState("week");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className='d-flex flex-column align-items-center justify-content-start text-white w-100 p-4' style={{ height: '100vh' }}>
      <div className='w-100 mb-3'>
        <h1>User Active</h1>
        <button
          onClick={() => setMode('week')}
          className={`btn me-2 ${mode === 'week' ? 'btn-primary' : 'btn-secondary'}`}>
          Last 7 Days
        </button>
        <button
          onClick={() => setMode('month')}
          className={`btn ${mode === 'month' ? 'btn-primary' : 'btn-secondary'}`}>
          Last 30 Days
        </button>
      </div>

      {/* Chart fills 50% of dashboard height */}
      <div className='w-100' style={{ height: '50%' }}>
        <LoginChart mode={mode} />
      </div>
    </div>
  );
}

export default AdminDashboard;
