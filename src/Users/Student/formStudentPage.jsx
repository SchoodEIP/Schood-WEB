import React, { useEffect, useState } from 'react'
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import moment from 'moment'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import IconFace0 from '../../assets/icon_face_0.png'
import IconFace1 from '../../assets/icon_face_1.png'
import IconFace2 from '../../assets/icon_face_2.png'
import { useNavigate, useParams } from 'react-router-dom'

const FormStudentPage = () => {
  const { id } = useParams()
  const [data, setData] = useState({})
  const [error, setError] = useState(null)
  const [currentCheck, setCurrentCheck] = useState(false)
  const imgImports = [IconFace0, IconFace1, IconFace2]
  const [answers, setAnswers] = useState([])
  const navigate = useNavigate()
  const [isAnswered, setIsAnswered] = useState(false)

  useEffect(() => {
    const handleCurrentCheck = (fromDate) => {
      const checkDate = new Date(fromDate)

      const currentDate = new Date()

      const currentDayOfWeek = currentDate.getDay()

      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1))
      startOfWeek.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      const result = checkDate >= startOfWeek && checkDate <= endOfWeek
      setCurrentCheck(!result)
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
          setData(data)
          handleCurrentCheck(data.fromDate)
        } else {
          setError(data.message)
        }
      })
      .catch(error => setError(error.message))

    const getAnswersUrl = process.env.REACT_APP_BACKEND_URL + '/student/questionnaire/' + id

    fetch(getAnswersUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        if (data !== null) {
          setIsAnswered(true)
          setAnswers(data.answers)
        }
      })
      .catch(error => setError(error.message))
  }, [id])

  function getFormAnswers () {
    const formAnswers = []
    data.questions.map((question, index) => {
      let result = null
      switch (question.type) {
        case 'text':
          result = document.getElementById('answer-' + index + '-0').value
          break
        case 'emoji':
          result = '-1'
          for (let i = 0; i < 3; i++) {
            if (document.getElementById('answer-' + index + '-' + i).checked) {
              result = `${i}`
            }
          }
          break
        case 'multiple':
          result = '-1'
          question.answers.map((multipleAnswer, i) => {
            if (document.getElementById('answer-' + index + '-' + i).checked) {
              result = `${i}`
            }
            return multipleAnswer
          })
          break
        default:
          break
      }
      const answerFormat = {
        question: question._id,
        answer: result
      }
      return formAnswers.push(answerFormat)
    })
    return formAnswers
  }

  function sendAnswers () {
    const data = getFormAnswers()
    const sendAnswerUrl = process.env.REACT_APP_BACKEND_URL + '/student/questionnaire/' + id
    fetch(sendAnswerUrl, {
      method: isAnswered ? 'PATCH' : 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers: data })
    }).then(response => response.json())
      .then(data => {
        if (!data.message) {
          setIsAnswered(true)
          navigate('/questionnaires')
        } else {
          setError(data.message)
        }
      })
      .catch(error => setError(error.message))
  }

  const checkAnswers = (question, i) => {
    let result
    answers.map((answer) => {
      if (answer.question === question._id) {
        if (question.type === 'text') {
          result = answer.answers[0]
        } else if (question.type === 'emoji') {
          result = (answer.answers[0] === i.toString())
        } else {
          result = (answer.answers.indexOf(question.answers[i].title) !== -1)
        }
      }
      return true
    })
    return result
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
                {(!data | !data.questions) ? 'Erreur' : data.title}
              </h1>
            </div>
            <div className='form-content-container'>
              <div><p className='bold-underline-text'>Du {moment(data.fromDate).format('DD/MM/YY')} au {moment(data.toDate).format('DD/MM/YY')}</p></div>
              {(!data | !data.questions)
                ? <div>{error}</div>
                : data.questions.map((question, index) => (
                  <div key={index} className='questions-container' id={`container-${index}`}>
                    <div className='question-container' data-testid={`question-container-${index}`}>
                      <div id='question-row'>
                        <h2>{`${index + 1}. ${question.title}`}</h2>
                      </div>
                    </div>

                    <div className='answer-row' id={'answers-' + index}>
                      {question.type === 'text' && (
                        <textarea
                          id={`answer-${index}-0`}
                          className='answer-text'
                          data-testid={`answer-${index}-0`}
                          disabled={currentCheck}
                          defaultValue={checkAnswers(question, index)}
                        />
                      )}
                      {question.type === 'emoji' && (
                        <div className='emoji-row'>
                          {imgImports.map((imgSrc, i) => (
                            <div key={i} className='emoji-container'>
                              <img style={{ width: '50px' }} src={imgSrc} alt={imgSrc} />
                              <input
                                type='checkbox'
                                id={`answer-${index}-${i}`}
                                data-testid={`answer-${index}-${i}`}
                                disabled={currentCheck}
                                defaultChecked={checkAnswers(question, i)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {question.type === 'multiple' && (
                        <ul>
                          {question.answers.map((answer, i) => (
                            <li key={i} style={{ gap: '25px', display: 'flex' }}>
                              <input
                                type='checkbox'
                                id={`answer-${index}-${i}`}
                                data-testid={`answer-${index}-${i}`}
                                disabled={currentCheck}
                                defaultChecked={checkAnswers(question, i)}
                              />
                              <span style={{ listStyle: 'none' }}>{answer.title}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <p id='form-error-message'>{error}</p>
            </div>
            <div className='validate-btn-container'>
              {currentCheck
                ? ''
                : <button className='button-css questionnaire-btn' type='submit' onClick={sendAnswers}>Valider le Questionnaire</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormStudentPage
