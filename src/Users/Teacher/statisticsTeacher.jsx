import React, { useState, useEffect, useRef } from 'react';
import HeaderComp from '../../Components/Header/headerComp';
import { Chart, ScatterController, PointElement, LinearScale, Title, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import '../../css/pages/homePage.scss';
import '../../css/pages/statistiques.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSadTear, faFrown, faMeh, faSmile, faLaughBeam } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { disconnect } from '../../functions/disconnect';

library.add(faSadTear, faFrown, faMeh, faSmile, faLaughBeam);

Chart.register(ScatterController, PointElement, LinearScale, Title, TimeScale);

const TeacherStatPage = () => {
  const [moodData, setMoodData] = useState([]);
  const [answerData, setAnswerData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeFilter, setActiveFilter] = useState('Semaine');
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [averageMood, setAverageMood] = useState(0);
  const [averagePercentage, setAveragePercentage] = useState(0);
  const moodChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const moodUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/statistics/dailyMoods`;
      const answersUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/statistics/answers`;

      try {
        const [moodResponse, answersResponse] = await Promise.all([
          fetch(moodUrl, {
            method: 'POST',
            headers: {
              'x-auth-token': sessionStorage.getItem('token'),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fromDate: calculateStartDate(selectedDate, activeFilter),
              toDate: calculateEndDate(selectedDate, activeFilter),
              classFilter: selectedClass || 'all',
            }),
          }),
          fetch(answersUrl, {
            method: 'POST',
            headers: {
              'x-auth-token': sessionStorage.getItem('token'),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fromDate: calculateStartDate(selectedDate, activeFilter),
              toDate: calculateEndDate(selectedDate, activeFilter),
              classFilter: selectedClass || 'all',
            }),
          }),
        ]);

        if (moodResponse.status === 401 || answersResponse.status === 401) {
          disconnect();
          return;
        }

        const mData = await moodResponse.json();
        const aData = await answersResponse.json();

        setAveragePercentage(mData.averagePercentage || 0);

        const moodList = Object.keys(mData).map((date) => ({
          date,
          data: mData[date]?.moods || [],
        }));

        const answerList = Object.keys(aData).map((date) => ({
          date,
          data: aData[date] || [],
        }));

        setMoodData(moodList);
        setAnswerData(answerList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchClasses = async () => {
      const classesUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/classes`;

      try {
        const response = await fetch(classesUrl, {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          disconnect();
          return;
        }

        const classesData = await response.json();
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchData();
    fetchClasses();
  }, [selectedDate, activeFilter, selectedClass]);

  useEffect(() => {
    const average = calculateAverageMood(moodData, averagePercentage);
    setAverageMood(average);
  }, [moodData, averagePercentage]);

  const calculateAverageMood = (data, averagePercentage) => {
    if (averagePercentage !== undefined) {
      return averagePercentage;
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return 0;
    }

    const total = data.reduce((acc, mood) => {
      if (mood.data && Array.isArray(mood.data)) {
        return acc + mood.data.reduce((a, b) => a + b, 0);
      }
      return acc;
    }, 0);

    const count = data.reduce((acc, mood) => {
      if (mood.data && Array.isArray(mood.data)) {
        return acc + mood.data.length;
      }
      return acc;
    }, 0);

    return count === 0 ? 0 : total / count;
  };

  const calculateStartDate = (date, filter) => {
    const selectedDate = new Date(date);
    switch (filter) {
      case 'Semaine':
        const monday = new Date(selectedDate);
        monday.setDate(monday.getDate() - selectedDate.getDay() + (selectedDate.getDay() === 0 ? -6 : 1));
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
        nextMonth.setDate(0);
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

  useEffect(() => {
    if (moodChartRef.current) {
      const ctx = moodChartRef.current.getContext('2d');
      const chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Humeur',
              data: moodData.map((mood) => ({
                x: new Date(mood.date).getTime(),
                y: calculateAverageMood(mood.data || []),
              })),
              borderColor: 'white',
              pointBackgroundColor: 'white',
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: { unit: 'day' },
            },
          },
        },
      });

      return () => chartInstance.destroy();
    }
  }, [moodData]);

  return (
    <div className="dashboard">
      <HeaderComp title="Mes statistiques" />
      <div className="page-content">
        <div className="filter-section">
          <div className="date-selector">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            {['Semaine', 'Mois', 'Semestre', 'Année'].map((filter) => (
              <button
                key={filter}
                className={activeFilter === filter ? 'active' : ''}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="class-selector">
            <select
              onChange={(e) => setSelectedClass(e.target.value)}
              value={selectedClass || ''}
            >
              <option value="">Toutes les classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="average-section">
          <h3>
            Humeur moyenne: {isNaN(averageMood) ? 'N/A' : averageMood.toFixed(2)}%
          </h3>
        </div>

        <div className="chart-section">
          <canvas ref={moodChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default TeacherStatPage;
