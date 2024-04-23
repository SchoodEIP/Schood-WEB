import React, { useEffect } from 'react'
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import moment from 'moment'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'

const FormListStudentPage = () => {
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
          const titleRows = document.getElementById('title-rows')
          const currentDate = new Date()

          data.forEach((questionnaire, index) => {
            const newDate = new Date(questionnaire.fromDate)
            if ((newDate.getDate() <= currentDate.getDate() && newDate.getMonth() === currentDate.getMonth()) ||
                (newDate.getMonth() < currentDate.getMonth())) {
              const fullContainer = document.createElement('div')
              fullContainer.id = 'container-' + index
              fullContainer.classList.add('full-container')

              const questDates = document.createElement('span')
              questDates.id = 'quest-dates-' + index
              questDates.innerHTML = 'Du ' + moment(questionnaire.fromDate).format('DD/MM/YY') + '\nau ' + moment(questionnaire.toDate).format('DD/MM/YY')
              questDates.classList.add('bold-underline-text')

              const container = document.createElement('div')
              container.id = 'questionnaire-' + index
              container.classList.add('question-title-container')

              const spanText = document.createElement('span')
              spanText.textContent = questionnaire.title

              const accessBtn = document.createElement('button')
              accessBtn.textContent = 'Y Accéder'
              accessBtn.classList.add('button-css')
              accessBtn.classList.add('questionnaire-btn')
              accessBtn.style.marginBottom = '10px'
              accessBtn.addEventListener('click', function () {
                accessForm(questionnaire._id)
              })

              container.appendChild(spanText)
              container.appendChild(accessBtn)
              fullContainer.appendChild(questDates)
              fullContainer.appendChild(container)
              titleRows.appendChild(fullContainer)
            }
          })
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
      <div>
        <HeaderComp />
      </div>
      <div className='different-page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='left-half'>
          <div className='form-container'>
            <div className='form-header'>
              <h1 className='form-header-title'>Mes Questionnaires</h1>
            </div>
            <div className='form-content-container'>
              <div id='title-rows' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormListStudentPage
