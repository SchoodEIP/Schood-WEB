import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import HeaderComp from '../../Components/Header/headerComp'
import TeacherFormContent from '../../Components/Questionnaire/teacherFormContent'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import '../../css/pages/formDetailPage.scss'
import { disconnect } from '../../functions/disconnect'

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

    function setAnswers (ultimateResponse, answeredForm) {
      answeredForm.answers.map((answer, i) => {
        if (ultimateResponse.questions[i]._id === answer.question) {
          if (ultimateResponse.questions[i].type === 'text') {
            ultimateResponse.questions[i].answers.push(answer.answers)
          } else if (ultimateResponse.questions[i].type === 'emoji') {
            ultimateResponse.questions[i].answers.map((options, j) => /* istanbul ignore next */ {
              if (options.position === parseInt(answer.answers)) {
                options.count += 1
              }
              return options
            })
          } else if (ultimateResponse.questions[i].type === 'multiple') {
            ultimateResponse.questions[i].answers.map((options, j) => /* istanbul ignore next */ {
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
      const theResponse = createFormContent(originForm)
      for (let i = 0; i < studentsArray.length; i++) {
        const answerListUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire/' + originForm._id + '/answers/' + studentsArray[i]._id
        await fetch(answerListUrl, {
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
            if (data._id) {
              setAnswers(theResponse, data)
            } else /* istanbul ignore next */ {
              setError(data.message)
            }
          })
          .catch(error => /* istanbul ignore next */ { setError(error.message) })
      }
      setFormData(theResponse)
    }

    async function getStudents (originForm) {
      const studentListUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire/' + originForm._id + '/students'

      await fetch(studentListUrl, {
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
          if (data.users) {
            getAnswers(originForm, data.users)
          } else /* istanbul ignore next */ {
            setError(data.message)
          }
        })
        .catch(error => /* istanbul ignore next */ { setError(error.message) })
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
    }).then(response => {
      if (response.status === 401) {
        disconnect();
      }
      return response.json()
    })
      .then(data => {
        if (data.title) {
          setFormData(data)
          getStudents(data)
          setIsModify(hasDatePassed(data.fromDate))
        } else {
          setError(data.message)
        }
      })
      .catch(error => /* istanbul ignore next */ { setError(error.message) })
  }, [id])

  const handleRedirect = () => {
    window.location.href = '/questionnaire/' + id + '/modify'
  }

  const buttonComponent = [
    {
      name: 'Modifier le Questionnaire',
      function: handleRedirect
    }
  ]

  return (
    <div className='form-page'>
      <div className='header'>
        <HeaderComp
          title={formData.title}
          subtitle={`Du ${moment(formData.fromDate).format('DD/MM/YYYY')} au ${moment(formData.toDate).format('DD/MM/YYYY')}`}
          withReturnBtn
          withLogo
          showButtons={!isModify}
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='different-page-content'>
        <div className='left-half' style={{ marginBottom: '20px', height: 'calc(100vh - 124px)', overflowY: 'auto' }}>
          <TeacherFormContent form={formData} error={error} />
        </div>
      </div>
    </div>
  )
}

export default FormTeacherPage
