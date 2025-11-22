import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import {useAuth} from '../../context/AuthContext';

function LoginChart({ mode }) {
  const { token } = useAuth();
  const canvasRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  useEffect(() => {
    if (!token) return;
    axios.get(`swp3912025springse1933group1backend-productionnewgen.up.railway.app/dashboard/chart`, { params: { mode } })
      .then(res => {
        const labels = res.data.map(item => {
          const date = new Date(item.label);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        const totals = res.data.map(item => item.total);

        if (chartInstance) chartInstance.destroy();

        const newChart = new Chart(canvasRef.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: `Users (${mode === 'week' ? '7' : '30'} Days)`,
              data: totals,
              backgroundColor: '#4e73df',
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date',
                  color: 'white'
                },
                ticks: {
                  color: 'white'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: false,
                  text: 'Users',
                  color: 'white'
                },
                ticks: {
                  color: 'white',
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: 'white'
                }
              },
              title: {
                color: 'white'
              }
            }
          }
        });

        setChartInstance(newChart);
      });
  }, [mode]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <canvas ref={canvasRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

export default LoginChart;
