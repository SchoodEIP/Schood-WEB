import React, { useState, useEffect } from 'react';
import HeaderComp from '../../Components/Header/headerComp';
import Sidebar from '../../Components/Sidebar/sidebar';
import Chart from 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../css/pages/homePage.css';
import '../../css/pages/statisticsStudent.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSadTear, faFrown, faMeh, faSmile, faLaughBeam } from '@fortawesome/free-solid-svg-icons'

library.add(faSadTear, faFrown, faMeh, faSmile, faLaughBeam)

const StudentStatPage = () => {
  const [moodData, setMoodData] = useState([]); // État local pour stocker toutes les données d'humeur
  const [filteredMoodData, setFilteredMoodData] = useState([]); // État local pour stocker les données filtrées
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Initialiser avec la date actuelle
  const [activeFilter, setActiveFilter] = useState([]); // État local pour suivre le filtre actif

  useEffect(() => {
    const fetchData = async () => {
      const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/student/statistics/moods';
      try {
        const testData = [
          { date: '2023-11-29', mood: 4 },
          { date: '2024-03-29', mood: 0 },
          { date: '2024-01-29', mood: 1 },
          { date: '2024-04-03', mood: 4 },
          { date: '2024-04-01', mood: 2 },
          { date: '2024-04-02', mood: 1 },
          { date: '2023-12-29', mood: 0 }, // Mauvaise humeur pour le 29/03/2024
          { date: '2024-03-30', mood: 3 }, // Bonne humeur pour le 30/03/2024
          { date: '2024-03-31', mood: 4 }  // Heureux pour le 31/03/2024
        ];
        // const response = await fetch(questionnaireUrl, {
        //   method: 'GET',
        //   headers: {
        //     'x-auth-token': sessionStorage.getItem('token'),
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();
        setMoodData(testData); // Mettre à jour l'état local avec les données d'humeur
      } catch (error) {
        console.error('Error fetching mood data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filtrer les données en fonction de la date sélectionnée
    const filteredData = moodData.filter(entry => entry.date === selectedDate);
    setFilteredMoodData(filteredData);
  }, [selectedDate, moodData]); // Appeler ce useEffect à chaque changement dans selectedDate ou moodData

  useEffect(() => {
    // Code pour afficher le graphique en utilisant Chart.js
    if (filteredMoodData.length > 0) {
      const sortedData = filteredMoodData.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

      const ctx = document.getElementById('moodChart').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: sortedData.map(entry => entry.date), // Utiliser les dates comme labels
          datasets: [{
            label: 'Évolution de l\'humeur',
            data: sortedData.map(entry => entry.mood), // Utiliser les valeurs d'humeur comme données
            borderColor: 'rgba(255, 255, 255, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
                color: 'white'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Humeur',
                color: 'white'
              },
              ticks: {
                callback: value => {
                  switch (value) {
                    case 0:
                      return '\u{1F622}'
                    case 1:
                      return '\u{1f641}'
                    case 2:
                      return '\u{1F610}'
                    case 3:
                      return '\u{1F603}'
                    case 4:
                      return '\u{1F604}'
                    default:
                      return '';
                  }
                },
                fontFamily: '"Font Awesome 5 Free"',
                color: 'white'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'white'
              }
            }
          },
          layout: {
          }
        }
      });
      return () => {
        chart.destroy(); // Nettoyer le graphique lors du démontage du composant
      };
    }
  }, [filteredMoodData]); // Appeler ce useEffect à chaque changement dans filteredMoodData

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Mettre à jour la date sélectionnée
    setActiveFilter([]);
  };

  useEffect(() => {
    // Appliquer le filtre par semaine et définir le bouton "Semaine" comme actif au montage du composant
    filterByWeek();
    setActiveFilter([]);
  }, []); // Appeler cette fonction une seule fois au montage du composant

  const filterByWeek = () => {
    // Récupérer le jour de la semaine de la date sélectionnée (0 pour dimanche, 1 pour lundi, ..., 6 pour samedi)
    const selectedDayOfWeek = new Date(selectedDate).getDay();
    // Calculer la date du lundi précédent
    const monday = new Date(selectedDate);
    monday.setDate(monday.getDate() - selectedDayOfWeek + (selectedDayOfWeek === 0 ? -6 : 1));
    const mondayDate = monday.toISOString().split('T')[0];

    // Calculer la date du dimanche suivant
    const sunday = new Date(mondayDate);
    sunday.setDate(sunday.getDate() + 6);
    const sundayDate = sunday.toISOString().split('T')[0];

    // Filtrer les données pour la semaine du lundi précédent au dimanche suivant
    const filteredData = moodData.filter(entry => entry.date >= mondayDate && entry.date <= sundayDate);
    setFilteredMoodData(filteredData);
    setActiveFilter('Semaine');
  };

  const filterByMonth = () => {
    // Récupérer le mois de la date sélectionnée (de 0 à 11, où 0 représente janvier et 11 représente décembre)
    const selectedMonth = new Date(selectedDate).getMonth();
    // Récupérer l'année de la date sélectionnée
    const selectedYear = new Date(selectedDate).getFullYear();

    // Filtrer les données pour le mois de la date sélectionnée
    const filteredData = moodData.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear;
    });
    setFilteredMoodData(filteredData);
    setActiveFilter('Mois');
  };

  const filterBySemester = () => {
    // Récupérer le mois de la date sélectionnée (de 0 à 11, où 0 représente janvier et 11 représente décembre)
    const selectedMonth = new Date(selectedDate).getMonth();
    // Récupérer l'année de la date sélectionnée
    const selectedYear = new Date(selectedDate).getFullYear();

    // Déterminer le semestre en fonction du mois
    const semester = selectedMonth < 8 ? 1 : 2; // Premier semestre si le mois est de janvier à août, deuxième semestre sinon

    // Filtrer les données pour le semestre de l'année scolaire correspondant à la date sélectionnée
    const filteredData = moodData.filter(entry => {
      const entryDate = new Date(entry.date);
      const entryMonth = entryDate.getMonth();
      const entryYear = entryDate.getFullYear();
      const entrySemester = entryMonth < 8 ? 1 : 2; // Déterminer le semestre de chaque entrée
      return entrySemester === semester && entryYear === selectedYear;
    });
    setFilteredMoodData(filteredData);
    setActiveFilter(`Semestre ${semester}`);
  };

  const filterByYear = () => {
    // Récupérer l'année scolaire correspondant à la date sélectionnée
    const selectedYear = new Date(selectedDate).getMonth() < 8 ? new Date(selectedDate).getFullYear() - 1 : new Date(selectedDate).getFullYear();

    // Filtrer les données pour l'année scolaire correspondant à la date sélectionnée
    const filteredData = moodData.filter(entry => {
      const entryYear = new Date(entry.date).getFullYear();
      return entryYear === selectedYear || entryYear === selectedYear + 1;
    });
    setFilteredMoodData(filteredData);
    setActiveFilter(`Année scolaire ${selectedYear}-${selectedYear + 1}`);
  };

  return (
    <div className='dashboard'>
      <HeaderComp />
      <div className='page-content'>
        <Sidebar />
        <div>
          <label htmlFor="dateFilter">Filtrer par date:</label>
          <input type="date" id="dateFilter" value={selectedDate} onChange={handleDateChange} />
          <button className={activeFilter === 'Semaine' ? 'active' : ''} onClick={filterByWeek}>Semaine</button>
          <button className={activeFilter === 'Mois' ? 'active' : ''} onClick={filterByMonth}>Mois</button>
          <button className={activeFilter.includes('Semestre') ? 'active' : ''} onClick={filterBySemester}>Semestre</button>
          <button className={activeFilter.includes('Année') ? 'active' : ''} onClick={filterByYear}>Année</button>
          <h1>Evolution de mon humeur</h1>
          <canvas id="moodChart"></canvas> {/* Canvas pour afficher le graphique */}
        </div>
      </div>
    </div>
  );
};

export default StudentStatPage;
