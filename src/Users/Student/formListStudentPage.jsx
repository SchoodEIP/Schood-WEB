import React, { useEffect, useState } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import moment from 'moment'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import rightArrow2 from '../../assets/rightArrow2.png'
import { Link } from 'react-router-dom'

const FormListStudentPage = () => {
  const [questionnaires, setQuestionnaires] = useState([])

  useEffect(() => {
    const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire'

    try {
      fetch(questionnaireUrl, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(data => {
          setQuestionnaires(data)
        })
        .catch(error => /* istanbul ignore next */ { console.error(error.message) })
    } catch (e) /* istanbul ignore next */ {
      console.error(e.message)
    }
  }, [])

  function accessForm (id) {
    window.location.href = '/questionnaire/' + id
  }

  return (
    <div className='form-page'>
      <HeaderComp
        title='Mes Questionnaires'
        withLogo
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

export default FormListStudentPage
