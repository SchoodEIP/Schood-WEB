import './dashboard_student.scss'
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { QuestSpace } from '../../Components/Questionnaire/QuestSpace'
import { GraphSpace } from '../../Components/Graph/GraphSpace'
import { LastAlerts } from '../../Components/Alerts/LastAlerts'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const StudentHomePage = () => {
  const [moodData, setMoodData] = useState([])
  const [questionnairesData, setQuestionnairesData] = useState([])
  const [alertsData, setAlertsData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const responseMood = await axios.get('http://schood.fr/mood')
      setMoodData(responseMood.data)

      const responseQuestionnaires = await axios.get('http://schood.fr/questionnaires')
      setQuestionnairesData(responseQuestionnaires.data)

      const responseAlerts = await axios.get('http://schood.fr/alerts')
      setAlertsData(responseAlerts.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='dashboard'>
      <div>
        <HeaderComp />
      </div>
      <div className='page-body'>
        <div className='left-half'>
          <Sidebar />
        </div>
        <div className='right-half'>
          <div>
            <div>
              <GraphSpace />
            </div>
            <div>
              <QuestSpace />
            </div>
          </div>
          <div>
            <LastAlerts />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentHomePage
