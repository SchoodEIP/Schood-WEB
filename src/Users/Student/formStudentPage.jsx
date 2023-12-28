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
  const imgImports = [IconFace0, IconFace1, IconFace2]
  const navigate = useNavigate()

  useEffect(() => {
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
        } else {
          setError(data.message)
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
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers: data })
    }).then(response => response.json())
      .then(data => {
        if (!data.message) {
          navigate('/questionnaires')
        } else {
          setError(data.message)
        }
      })
      .catch(error => setError(error.message))
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
              <div><p class="bold-underline-text">Du {moment(data.fromDate).format('DD/MM/YY')} au {moment(data.toDate).format('DD/MM/YY')}</p></div>
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
                        />
                      )}
                      {question.type === 'emoji' && (
                        <div className='emoji-row'>
                          {imgImports.map((imgSrc, i) => (
                            <div key={i} className='emoji-container'>
                              <img src={imgSrc} alt={imgSrc} />
                              <input
                                type='checkbox'
                                id={`answer-${index}-${i}`}
                                data-testid={`answer-${index}-${i}`}
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
              <button className='button-css questionnaire-btn' type='submit' onClick={sendAnswers}>Valider le Questionnaire</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormStudentPage
