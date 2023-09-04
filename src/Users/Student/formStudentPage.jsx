import React, { useEffect, useState } from 'react'
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import IconFace0 from '../../assets/icon_face_0.png'
import IconFace1 from '../../assets/icon_face_1.png'
import IconFace2 from '../../assets/icon_face_2.png'
import { useParams } from 'react-router-dom'

const FormStudentPage = () => {
  const { id } = useParams()
  const [data, setData] = useState({})
  const [error, setError] = useState(null)
  const imgImports = [IconFace0, IconFace1, IconFace2]

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
            <div className='validate-btn-container'>
              <button className='button-css questionnaire-btn'>Valider le Questionnaire</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormStudentPage
