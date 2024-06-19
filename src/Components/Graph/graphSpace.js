import React, { useEffect, useState } from 'react';
import '../../css/Components/Graph/graphSpace.scss';
import { Link } from 'react-router-dom';
import rightArrow from '../../assets/right-arrow.png';
import { Chart } from 'chart.js';
import { disconnect } from '../../functions/disconnect';

export function GraphSpace() {
  const [title, setTitle] = useState('');
  const [moodData, setMoodData] = useState([]);
  const [chart, setChart] = useState(null);
  const role = sessionStorage.getItem('role');

  useEffect(() => {
    const setTitleByPerm = () => {
      if (role === 'student') {
        setTitle('Evolution de mon humeur');
      } else if (role === 'teacher') {
        setTitle("Evolution de l'humeur de mes classes");
      } else {
        setTitle("Evolution de l'humeur de mon établissement");
      }
    };
    setTitleByPerm();
  }, [role]);

  useEffect(() => {
    if (role === 'student') {
      const fetchData = async () => {
        const moodUrl = process.env.REACT_APP_BACKEND_URL + '/student/statistics/dailyMoods';
        try {
          const response = await fetch(moodUrl, {
            method: 'POST',
            headers: {
              'x-auth-token': sessionStorage.getItem('token'),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fromDate: calculateStartDate(),
              toDate: calculateEndDate(),
            }),
          });
          if (response.status === 401) {
            disconnect();
          }
          const moodData = await response.json();
          setMoodData(moodData);
          createOrUpdateChart(moodData);
        } catch (error) {
          console.error('Error fetching mood data:', error);
        }
      };
      fetchData();
    }
  }, [role]);

  const createOrUpdateChart = (moodData) => {
    if (!moodData || Object.keys(moodData).length === 0) return;

    const ctx = document.getElementById('moodChart');
    if (!chart) {
      const newChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Object.keys(moodData).filter((key) => key !== 'averagePercentage'),
          datasets: [
            {
              label: 'Humeur',
              data: Object.values(moodData).filter((val) => typeof val === 'number'),
              borderColor: 'white',
              pointBackgroundColor: 'white',
              pointBorderColor: 'white',
              pointHoverBackgroundColor: 'white',
              pointHoverBorderColor: 'white',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: {
                color: 'white',
                fontFamily: '"Font Awesome 5 Free"',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
            y: {
              min: 0,
              max: 4,
              ticks: {
                callback: (value) => {
                  switch (value) {
                    case 0:
                      return '\u{1F622}';
                    case 1:
                      return '\u{1f641}';
                    case 2:
                      return '\u{1F610}';
                    case 3:
                      return '\u{1F603}';
                    case 4:
                      return '\u{1F604}';
                    default:
                      return '';
                  }
                },
                color: 'white',
                fontFamily: '"Font Awesome 5 Free"',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: 'white',
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const moodValue = context.raw.y;
                  switch (moodValue) {
                    case 0:
                      return 'Très mal';
                    case 1:
                      return 'Mal';
                    case 2:
                      return 'Neutre';
                    case 3:
                      return 'Bien';
                    case 4:
                      return 'Très bien';
                    default:
                      return '';
                  }
                },
              },
            },
          },
        },
      });
      setChart(newChart);
    } else {
      const dates = Object.keys(moodData).filter((key) => key !== 'averagePercentage');
      const data = dates.map((date) => ({
        x: date,
        y: moodData[date],
        r: 10,
      }));

      chart.data.datasets[0].data = data;
      chart.update();
    }
  };

  const calculateStartDate = () => {
    const selectedDate = new Date();
    const selectedDayOfWeek = selectedDate.getDay();
    const monday = new Date(selectedDate);
    monday.setDate(monday.getDate() - selectedDayOfWeek + (selectedDayOfWeek === 0 ? -6 : 1));
    return monday.toISOString().split('T')[0];
  };

  const calculateEndDate = () => {
    const selectedDate = new Date();
    const sunday = new Date(selectedDate);
    sunday.setDate(sunday.getDate() - selectedDate.getDay() + 7);
    return sunday.toISOString().split('T')[0];
  };

  return (
    <div className='graph-box'>
      <div className='graph-header'>
        <span className='title'>{title}</span>
        <Link to='/statistiques' className='see-more'>
          Voir plus
          <img className='img' src={rightArrow} alt='Right arrow' />
        </Link>
      </div>
      <div className='graph-body'>
        {role === 'student' ? (
          <div className='graph-content'>
            <div className='chart-container'>
              <canvas id='moodChart' />
            </div>
          </div>
        ) : role === 'teacher' ? (
          <div className='graph-content'>
            <p>Graphique de l'évolution de l'humeur des classes</p>
            {/* Add teacher-specific chart or content here */}
          </div>
        ) : (
          <div className='graph-content'>
            <p>Graphique de l'évolution de l'humeur de l'établissement</p>
            {/* Add institution-specific chart or content here */}
          </div>
        )}
      </div>
    </div>
  );
}
