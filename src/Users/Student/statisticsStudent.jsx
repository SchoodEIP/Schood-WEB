import React, { useState, useEffect } from 'react';
import HeaderComp from '../../Components/Header/headerComp';
import Sidebar from '../../Components/Sidebar/sidebar';
import Chart from 'chart.js/auto';
import '../../css/pages/homePage.css';
import '../../css/pages/statisticsStudent.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSadTear, faFrown, faMeh, faSmile, faLaughBeam } from '@fortawesome/free-solid-svg-icons';

library.add(faSadTear, faFrown, faMeh, faSmile, faLaughBeam);

const StudentStatPage = () => {
  const [moodData, setMoodData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeFilter, setActiveFilter] = useState('Semaine');
  const [chart, setChart] = useState(null)

  useEffect(() => {
    fetchData();
  }, [selectedDate, activeFilter]); // Fetch data when selectedDate or activeFilter changes

  useEffect(() => {
    if (chart) {
      updateChart();
    } else {
      createChart();
    }
  }, [moodData])

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
      const moodData = await response.json();
      setMoodData(moodData);
      console.log(moodData)
    } catch (error) {
      console.error('Error fetching mood data:', error);
    }
  };

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

  const createChart = () => {
    const ctx = document.getElementById('moodChart');
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: moodData.map(entry => entry.date),
        datasets: [{
          label: 'Humeur',
          data: moodData.map(entry => entry.mood),
          borderColor: 'white', // Couleur de la courbe
          backgroundColor: 'white', // Couleur des points
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            ticks: {
              color: 'white', // Couleur de l'axe des ordonnées
              callback: value => {
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
              fontFamily: '"Font Awesome 5 Free"'
            }
          },
          x: {
            ticks: {
              color: 'white' // Couleur de l'axe des abscisses
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white' // Couleur de la légende
            }
          }
        }
      }
    });
    setChart(newChart);
  };

  const updateChart = () => {
    if (moodData) {
      const dates = Object.keys(moodData).filter(key => key !== 'averagePercentage');
      const moods = Object.values(moodData).filter(val => typeof val === 'number');
  
      const data = dates.map(date => {
        return {
          x: date,
          y: moodData[date],
          r: 10 // Taille du point
        };
      });
  
      chart.data.datasets[0].data = data;
      chart.update();
    }
  }

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className='dashboard'>
      <HeaderComp />
      <div className='page-content'>
        <Sidebar />
        <div>
          <label htmlFor="dateFilter">Sélectionner une date:</label>
          <input type="date" id="dateFilter" value={selectedDate} onChange={handleDateChange} />
          <button className={activeFilter === 'Semaine' ? 'active' : ''} onClick={() => handleFilterChange('Semaine')}>Semaine</button>
          <button className={activeFilter === 'Mois' ? 'active' : ''} onClick={() => handleFilterChange('Mois')}>Mois</button>
          <button className={activeFilter === 'Semestre' ? 'active' : ''} onClick={() => handleFilterChange('Semestre')}>Semestre</button>
          <button className={activeFilter === 'Année' ? 'active' : ''} onClick={() => handleFilterChange('Année')}>Année</button>
          <h1>Evolution de mon humeur</h1>
          <canvas id="moodChart"></canvas>
        </div>
      </div>
    </div>
  );
}

export default StudentStatPage;
