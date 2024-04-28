import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../../css/pages/homePage.scss'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'

const TeacherStatPage = () => {
  const [dailyMood, setDailyMood] = useState([])
  const [negativeResponse, setNegativeResponse] = useState(null)

  // Utilise useParams pour extraire l'ID du mood du chemin de l'URL
  const { id } = useParams()

  useEffect(() => {
    // Vérifie si l'ID est défini avant de faire la requête GET
    if (id) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/teacher/dailyMood/${id}`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then((data) => setDailyMood(data))
        .catch((error) => {
          setNegativeResponse('Erreur lors de la récupération des statistiques', error.message)
        })
    }
  }, [id])

  return (
    <div className='dashboard'>
      <div>
        <HeaderComp />
      </div>
      <div className='page-content'>
        <div className='mood-container'>
          <h2>Statistiques des étudiants</h2>
          {negativeResponse && <p>{negativeResponse}</p>}
          {Array.isArray(dailyMood) && dailyMood.length > 0
            ? (
                dailyMood.map((mood, index) => (
                  <div key={index} className='message'>
                    <div className='message-header'>
                      <span className='message-username'>{mood.studentName}</span>
                      <span className='message-time'>{mood.date}</span>
                    </div>
                    <div className='message-content'>
                      <p>Humeur: {mood.feeling}</p>
                    </div>
                  </div>
                ))
              )
            : (
              <p>Aucunes statistiques disponible.</p>
              )}
        </div>
      </div>
    </div>
  )
}

export default TeacherStatPage
