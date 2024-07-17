import React, { useState, useEffect, useRef } from 'react';
import HeaderComp from '../../Components/Header/headerComp';
import { Chart } from 'chart.js';
import '../../css/pages/homePage.scss';
import '../../css/pages/statistiques.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear, faFrown, faMeh, faSmile, faLaughBeam } from '@fortawesome/free-solid-svg-icons';
import { disconnect } from '../../functions/disconnect';

library.add(faSadTear, faFrown, faMeh, faSmile, faLaughBeam);

const StudentStatPage = () => {
  const [moodData, setMoodData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeFilter, setActiveFilter] = useState('Semaine');
  const [averagePercentage, setAveragePercentage] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const moodUrl = process.env.REACT_APP_BACKEND_URL + '/student/statistics/dailyMoods';
      try {
        const response = await fetch(moodUrl, {
          method: 'POST',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fromDate: calculateStartDate(selectedDate, activeFilter),
            toDate: calculateEndDate(selectedDate, activeFilter)
          })
        });
        if (response.status === 401) {
          disconnect();
        }
        const moodData = await response.json();
        setMoodData(moodData);
        if (moodData && moodData.averagePercentage) {
          setAveragePercentage(moodData.averagePercentage);
        }
      } catch (error) {
        console.error('Error fetching mood data:', error);
      }
    };
    fetchData();
  }, [selectedDate, activeFilter]); // Fetch data when selectedDate or activeFilter changes

  useEffect(() => {
    const createChart = () => {
      if (!moodData || Object.keys(moodData).length === 0) return
      const ctx = document.getElementById('moodChart').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Object.keys(moodData).filter(key => key !== 'averagePercentage'),
          datasets: [{
            label: 'Humeur',
            data: Object.values(moodData).filter(val => typeof val === 'number'),
            borderColor: 'white',
            pointBackgroundColor: 'white',
            pointBorderColor: 'white',
            pointHoverBackgroundColor: 'white',
            pointHoverBorderColor: 'white',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                color: 'white',
                fontFamily: '"Font Awesome 5 Free"'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            y: {
              suggestedMin: 0,
              suggestedMax: 4,
              ticks: {
                callback: value => {
                  switch (value) {
                    case 0:
                      return '\u{1F622}'; // Very sad
                    case 1:
                      return '\u{1f641}'; // Sad
                    case 2:
                      return '\u{1F610}'; // Neutral
                    case 3:
                      return '\u{1F603}'; // Happy
                    case 4:
                      return '\u{1F604}'; // Very happy
                    default:
                      return '';
                  }
                },
                color: 'white',
                fontFamily: '"Font Awesome 5 Free"'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const moodValue = context.raw;
                  const date = context.label;
                  let moodDescription = '';
                  switch (moodValue) {
                    case 0:
                      moodDescription = 'Très mal';
                      break;
                    case 1:
                      moodDescription = 'Mal';
                      break;
                    case 2:
                      moodDescription = 'Neutre';
                      break;
                    case 3:
                      moodDescription = 'Bien';
                      break;
                    case 4:
                      moodDescription = 'Très bien';
                      break;
                    default:
                      moodDescription = '';
                      break;
                  }
                  return `${date}: ${moodDescription}`;
                }
              }
            }
          }
        }
      });
    };

    const updateChart = () => {
      if (chartRef.current && moodData) {
        const dates = Object.keys(moodData).filter(key => key !== 'averagePercentage');
        const data = dates.map(date => ({
          x: date,
          y: moodData[date],
          r: 10 // Taille du point
        }));

        chartRef.current.data.labels = dates;
        chartRef.current.data.datasets[0].data = data;
        chartRef.current.update();
      }
    };

    if (!chartRef.current) {
      createChart();
    } else {
      updateChart();
    }
  }, [moodData, selectedDate, activeFilter]);

  const calculateStartDate = (date, filter) => {
    const selectedDate = new Date(date);
    switch (filter) {
      case 'Semaine':
        const selectedDayOfWeek = selectedDate.getDay();
        const monday = new Date(selectedDate);
        monday.setDate(monday.getDate() - selectedDayOfWeek + (selectedDayOfWeek === 0 ? -6 : 1));
        return monday.toISOString().split('T')[0];
      case 'Mois':
        return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString().split('T')[0];
      case 'Semestre':
        const semesterStartMonth = selectedDate.getMonth() < 8 ? 0 : 8;
        return new Date(selectedDate.getFullYear(), semesterStartMonth, 1).toISOString().split('T')[0];
      case 'Année':
        return new Date(selectedDate.getFullYear(), 0, 1).toISOString().split('T')[0];
      default:
        return selectedDate.toISOString().split('T')[0];
    }
  };

  const calculateEndDate = (date, filter) => {
    const selectedDate = new Date(date);
    switch (filter) {
      case 'Semaine':
        const sunday = new Date(selectedDate);
        sunday.setDate(sunday.getDate() - selectedDate.getDay() + 7);
        return sunday.toISOString().split('T')[0];
      case 'Mois':
        const nextMonth = new Date(selectedDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(nextMonth.getDate() - 1);
        return nextMonth.toISOString().split('T')[0];
      case 'Semestre':
        const semesterEndMonth = selectedDate.getMonth() < 8 ? 6 : 11;
        const endMonth = new Date(selectedDate.getFullYear(), semesterEndMonth + 1, 0);
        return endMonth.toISOString().split('T')[0];
      case 'Année':
        return new Date(selectedDate.getFullYear(), 11, 31).toISOString().split('T')[0];
      default:
        return selectedDate.toISOString().split('T')[0];
    }
  };

  const handleDateChange = event => {
    setSelectedDate(event.target.value);
  };

  const handleFilterChange = filter => {
    setActiveFilter(filter);
  };

  let filterText;
  let filterTextSec;
  switch (activeFilter) {
    case 'Semaine':
      filterText = 'cette semaine';
      filterTextSec = 'la semaine précédente';
      break;
    case 'Mois':
      filterText = 'ce mois';
      filterTextSec = 'le mois précédent';
      break;
    case 'Semestre':
      filterText = 'ce semestre';
      filterTextSec = 'le semestre précédent';
      break;
    case 'Année':
      filterText = 'cette année';
      filterTextSec = "l'année précédente";
      break;
    default:
      filterText = 'cette période';
      filterTextSec = 'la précédente';
      break;
  }

  return (
    <div className='dashboard'>
      <HeaderComp title='Mes statistiques' />
      <div className='page-content'>
        <div>
          <label htmlFor='dateFilter'>Sélectionner une date:</label>
          <input type='date' id='dateFilter' value={selectedDate} onChange={handleDateChange} />
          <div className='button-container'>
            <div
              className={`button-section ${activeFilter === 'Semaine' ? 'active' : ''}`}
              onClick={() => handleFilterChange('Semaine')}
            >
              Semaine
            </div>
            <div
              className={`button-section ${activeFilter === 'Mois' ? 'active' : ''}`}
              onClick={() => handleFilterChange('Mois')}
            >
              Mois
            </div>
            <div
              className={`button-section ${activeFilter === 'Semestre' ? 'active' : ''}`}
              onClick={() => handleFilterChange('Semestre')}
            >
              Semestre
            </div>
            <div
              className={`button-section ${activeFilter === 'Année' ? 'active' : ''}`}
              onClick={() => handleFilterChange('Année')}
            >
              Année
            </div>
          </div>
          <h1>Evolution de mon humeur</h1>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <canvas id='moodChart' width='400' height='400' />
            {averagePercentage !== null && (
              <div style={{ display: 'block', width: '40px', height: '10px' }}>
                <FontAwesomeIcon icon={faSmile} size='2x' style={{ marginRight: '10px' }} />
                <progress className='progress' value={averagePercentage} max='100' />
                <div className='average-rectangle'>
                  <p data-testid='average-happiness-percentage'>
                    Vous êtes {averagePercentage}% plus heureux {filterText} que {filterTextSec}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStatPage;
