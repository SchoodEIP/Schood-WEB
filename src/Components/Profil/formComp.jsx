import React, { useEffect, useState } from 'react'
import { disconnect } from '../../functions/disconnect'
import moment from 'moment'
import '../../css/pages/profilPage.scss'

export default function FormComp ({ id }) {
  const [questionnaires, setQuestionnaires] = useState([])

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/?id=` + id, {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        if (response.status === 401) {
          disconnect()
        }

        if (!response.ok) /* istanbul ignore next */ {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setQuestionnaires(data)
        console.log(data)
      } catch (error) /* istanbul ignore next */ {
        console.error('Erreur lors de la récupération du profil', error.message)
      }
    }

    fetchForms()
  }, [])

  return (
    <div className='profile-component-container' style={{ height: '225px' }}>
      <h3>Evaluation de mon humeur</h3>
      <div className='profile-forms-container'>
        {
                questionnaires.length > 0 && questionnaires.map((dateRange, index) => (
                  <div className={`profile-form-container ${index < questionnaires.length - 1 ? 'border-bottom' : ''}`} key={index}>
                    <span>{dateRange.questionnaires[0]?.title}</span>
                    <span>Du {moment(dateRange.fromDate).format('DD/MM/YYYY')} au {moment(dateRange.toDate).format('DD/MM/YYYY')}</span>
                  </div>
                ))
              }
      </div>
    </div>
  )
}
