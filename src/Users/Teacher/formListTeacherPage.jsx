import React, { useEffect, useState } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import moment from 'moment'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import rightArrow2 from '../../assets/rightArrow2.png'
import { Link } from 'react-router-dom'
import { disconnect } from '../../functions/sharedFunctions'

const FormListTeacherPage = () => {
  const [questionnaires, setQuestionnaires] = useState([])

  useEffect(() => {
    const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire'

    fetch(questionnaireUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 401) {
        disconnect();
      }
      return response.json()
    })
      .then(data => {
        setQuestionnaires(data)
      })
      .catch(error => console.error(error.message))

  }, [])

  function createNewForm () {
    window.location.href = '/questionnaire'
  }

  const buttonComponent = [
    {
      name: 'Créer un Questionnaire',
      function: createNewForm
    }
  ]

  return (
    <div className='form-page'>
      <HeaderComp
        title='Mes Questionnaires'
        withLogo
        showButtons
        buttonComponent={buttonComponent}
      />
      <div className='content'>
        {questionnaires.length === 0 && (
          <div className='no-questionnaire'>
            Aucun questionnaire disponible
          </div>
        )}
        {questionnaires.length > 0 && questionnaires.map((dateRange, index) => (
          <div key={index} className='dateRange'>
            <div className='header'>
              <div>
                Du {moment(dateRange.fromDate).format('DD/MM/YYYY')} au {moment(dateRange.toDate).format('DD/MM/YYYY')}
              </div>
              <span className='divider' />
            </div>
            {dateRange.questionnaires.map((questionnaire, index2) => (
              <Link key={index2} style={{ textDecoration: 'none' }} to={`/questionnaire/${questionnaire._id}`}>
                <div className='questionnaire'>
                  <div className='content-q'>
                    <div>
                      {questionnaire.title}
                    </div>
                    <img id='right-arrow' src={rightArrow2} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FormListTeacherPage
