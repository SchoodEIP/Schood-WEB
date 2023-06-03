import './dashboard_student.scss';
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/AdminMenu/index'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [moodData, setMoodData] = useState([]);
  const [questionnairesData, setQuestionnairesData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const responseMood = await axios.get('http://schood.fr/mood');
      setMoodData(responseMood.data);

      const responseQuestionnaires = await axios.get('http://schood.fr/questionnaires');
      setQuestionnairesData(responseQuestionnaires.data);

      const responseAlerts = await axios.get('http://schood.fr/alerts');
      setAlertsData(responseAlerts.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard">
      <div>
        <HeaderComp></HeaderComp>
      </div>
      <div className='page-body'>
        <div className="left-half">
          <Sidebar/>
        </div>
        <div className='right-half'>
          <div className="column column-1">
            <div className="section evolution">
              <div className="section-header">
                <div className="section-title">Évolution</div>
              </div>
              {/* Contenu de la section d'évolution */}
            </div>
            <div className="section questionnaires">
              <div className="section-header">
                <div className="section-title">Questionnaires</div>
              </div>
              {/* Contenu de la section des questionnaires */}
            </div>
          </div>
          <div className="column-2">
            <div className="section alerts">
              <div className="section-header">
                <div className="section-title">Alertes</div>
              </div>
              {/* Contenu de la section des alertes */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
