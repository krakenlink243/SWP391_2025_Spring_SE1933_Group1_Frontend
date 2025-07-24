import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import LoginChart from '../../components/LoginChart/LoginChart';
import {AppContext} from '../../context/AppContext';
import { useContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
function AdminDashboard({ tab }) {
  const{onlineUsers} = useContext(AppContext);
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const [mode, setMode] = useState("week");
  const [formData, setFormData] = useState({
    userCount: 0,
    publisherCount: 0,
    pendingCount: 0,
    revenue: 0
  })
  const fetchData = async()=>{
    try{
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/users/count`);
      console.log(res.data);
      setFormData(prev => ({
        ...prev,
        userCount: res.data.value
      }));
      res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/publishers/count`);
      console.log(res.data);
      setFormData(prev => ({
        ...prev,
        publisherCount: res.data.value
      }));
      res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/requests/pending/count`);
      console.log(res.data);
      setFormData(prev => ({
        ...prev,
        pendingCount: res.data.value
      }));
      res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/revenue`);
      console.log(res.data);
      setFormData(prev => ({
        ...prev,
        revenue: res.data.value
      }));
          }catch(err){
            console.log(err);
          }
  }
  useEffect(()=>{
    fetchData();
  },[])
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
      <div className='w-100' style={{ height: '40%' }}>
        <LoginChart mode={mode} />
      </div>
      <div className='w-100 mt-2'>
        <div className='row g-3'>
          <div className='col-md-4'>
            <div className='bg-dark p-3 rounded text-center shadow'>
              <h5>Total Users</h5>
              <p className='fs-4 fw-bold text-info'>{formData.userCount}</p>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='bg-dark p-3 rounded text-center shadow'>
              <h5>Publishers</h5>
              <p className='fs-4 fw-bold text-info'>{formData.publisherCount}</p>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='bg-dark p-3 rounded text-center shadow'>
              <h5>Online Users</h5>
              <p className='fs-4 fw-bold text-info'>{onlineUsers.length}</p>
            </div>
          </div>

          <div className='col-md-4'>
            <div className='bg-dark p-3 rounded text-center shadow'>
              <h5>Monthly Revenue</h5>
              <p className='fs-4 fw-bold text-success'>${formData.revenue}</p>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='bg-dark p-3 rounded text-center shadow'>
              <h5>Refund Rate</h5>
              <p className='fs-4 fw-bold text-info'>5%</p>
            </div>
          </div>
          <div className='col-md-4'>
            <div className='bg-dark p-3 rounded text-center shadow'>
              <h5>Pending Request</h5>
              <p className='fs-4 fw-bold text-warning'>{formData.pendingCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
