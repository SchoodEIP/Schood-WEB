import React, { useState, useEffect } from 'react'
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import TeacherFormContent from '../../Components/Questionnaire/teacherFormContent'

const FormTeacherPage = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [isModify, setIsModify] = useState('false')

  useEffect(() => {
    function createFormContent (originForm) {
      const ultimateResponse = {
        questions: [],
        title: originForm.title,
        fromDate: originForm.fromDate,
        toDate: originForm.toDate,
        createdBy: {
          firstname: originForm.createdBy.firstname,
          lastname: originForm.createdBy.lastname
        }
      }
      originForm.questions.map((question, index) => {
        const quest = {
          _id: question._id,
          title: question.title,
          type: question.type,
          answers: []
        }
        if (question.type === 'multiple') {
          question.answers.map((answer, i) =>
            quest.answers.push({
              _id: answer._id,
              title: answer.title,
              position: answer.position,
              count: 0
            })
          )
        } else if (question.type === 'emoji') {
          quest.answers.push({
            position: 0,
            count: 0
          })
          quest.answers.push({
            position: 1,
            count: 0
          })
          quest.answers.push({
            position: 2,
            count: 0
          })
        }
        ultimateResponse.questions.push(quest)
        return ultimateResponse
      })
      return ultimateResponse
    }

    function setAnswers(ultimateResponse, answeredForm) {
      answeredForm.answers.map((answer, i) => {
        if (ultimateResponse.questions[i]._id === answer.question) {
          if (ultimateResponse.questions[i].type === 'text') {
            ultimateResponse.questions[i].answers.push(answer.answers)
          } else if (ultimateResponse.questions[i].type === 'emoji') {
            ultimateResponse.questions[i].answers.map((options, j) => {
              if (options.position === parseInt(answer.answers)) {
                options.count += 1
              }
              return options
            })
          } else if (ultimateResponse.questions[i].type === 'multiple') {
            ultimateResponse.questions[i].answers.map((options, j) => {
              if ((options.title) === (answer.answers[0])) {
                options.count += 1
              }
              return options
            })
          }
        }
        return answer
      })
      return ultimateResponse
    }

    async function getAnswers (originForm, studentsArray) {

      let theResponse = createFormContent(originForm)
      for (let i = 0; i < studentsArray.length; i++) {
        const answerListUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire/' + originForm._id + '/answers/' + studentsArray[i]._id
        await fetch(answerListUrl, {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
          .then(data => {
            if (data._id) {
              setAnswers(theResponse, data)
            } else {
              setError(data.message)
            }
          })
          .catch(error => setError(error.message))
      }
      setFormData(theResponse)
    }

    async function getStudents(originForm) {
      const studentListUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire/' + originForm._id + '/students'

      await fetch(studentListUrl, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(data => {
          if (data.users) {
            getAnswers(originForm, data.users)
          } else {
            setError(data.message)
          }
        })
        .catch(error => setError(error.message))
    }

    function hasDatePassed (targetDate) {
      const currentDate = new Date()
      const givenDate = new Date(targetDate)

      return givenDate < currentDate
    }

    const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire/' + id

    fetch(questionnaireUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        if (data.title) {
          setFormData(data)
          getStudents(data)
          setIsModify(hasDatePassed(data.fromDate))
        } else {
          setError(data.message)
        }
      })
      .catch(error => setError(error.message))
  }, [id])

  function handleRedirect () {
    window.location.href = '/questionnaire/' + id + '/modify'
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
            <div className='form-header' id='title-container'>
              <h1 className='form-header-title' id='form-header-title' data-testid='form-header-title'>
                {(!formData | !formData.questions) ? 'Erreur' : formData.title}
              </h1>
            </div>
            <div className='form-content-container'>
              <div className='div-flex-horizontal'>
                <p className='bold-underline-text'>Du {moment(formData.fromDate).format('DD/MM/YY')} au {moment(formData.toDate).format('DD/MM/YY')}</p>
                {formData.createdBy ? <p className='bold-underline-text'>Créé par {formData.createdBy.firstname} {formData.createdBy.lastname}</p> : '' }
                {isModify
                  ? ''
                  : <button className='button-css questionnaire-btn' onClick={handleRedirect}>Modifier le questionnaire</button>}
              </div>
              <TeacherFormContent form={formData} error={error}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormTeacherPage
