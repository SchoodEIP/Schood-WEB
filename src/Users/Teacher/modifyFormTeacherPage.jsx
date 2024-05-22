import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import HeaderComp from '../../Components/Header/headerComp'
import Popup from 'reactjs-popup'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/disconnect'

const ModifyFormTeacherPage = () => {
  const [questionInc, setQuestionInc] = useState(1)
  const [errMessage, setErrMessage] = useState('')
  const [questions, setQuestions] = useState([])
  const [position, setPosition] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const { id } = useParams()
  const [parutionDate, setParutionDate] = useState(null)
  const [title, setTitle] = useState({})

  useEffect(() => {
    const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire/' + id

    fetch(questionnaireUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 401) {
        disconnect()
      }
      return response.json()
    })
      .then(data => {
        if (data.title) {
          setTitle(data.title)
          setQuestions(data.questions)
          setQuestionInc(data.questions.length)
          setParutionDate(moment(data.fromDate).format('YYYY-MM-DD'))
        } else {
          setErrMessage(data.message)
        }
      })
      .catch(error => /* istanbul ignore next */ { setErrMessage(error.message) })
  }, [id])

  function postQuestions () {
    const title = document.getElementById('form-title').value
    const date = document.getElementById('parution-date').value

    let proceed = true

    if (title !== '') {
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].title === '') {
          setErrMessage(`Question n°${i + 1} n'a pas été renseignée.`)
          proceed = false
          break
        } else if (questions[i].type === 'multiple') {
          for (let j = 0; j < questions[i].answers.length; j++) {
            if (questions[i].answers[j].title === '') {
              proceed = false
              setErrMessage(`La réponse n°${j + 1} de la question n°${i + 1} n'a pas été renseignée.`)
              break
            }
          }
        }
      }
    } else {
      proceed = false
      setErrMessage('Le questionnaire n\'a pas de titre.')
    }

    if (proceed) {
      fetch(process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire/' + id, {
        method: 'PATCH',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          date,
          questions
        })
      }).then(response => {
        if (response.status === 401) {
          disconnect()
        } else if (response.status !== 200) {
          setErrMessage(response.status + ' error : ' + response.statusText)
        } else {
          window.location.href = '/questionnaire/' + id
        }
      })
        .catch(error => setErrMessage(error.message))
    }
  }

  useEffect(() => {
    const today = new Date()
    const daysUntilNextMonday = (1 - today.getDay() + 7) % 7
    const nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilNextMonday)
    setParutionDate(nextMonday)
  }, [])

  const filterMonday = (date) => /* istanbul ignore next */ {
    setPosition(0)
    return date.getDay() === 1 && date >= new Date()
  }

  const handleAddNewQuestion = () => {
    setQuestionInc(questionInc + 1)
    questions.push({
      title: '',
      type: 'text',
      answers: []
    })
    setQuestions(questions)
    setPosition(0)
  }

  const handleRemoveLastQuestion = () => {
    setQuestionInc(questionInc - 1)
    setQuestions(prevQuestion => {
      const newQuestion = [...prevQuestion]
      newQuestion.pop()
      return newQuestion
    })
  }

  const handleChangeTitle = (event, index) => {
    questions[index].title = event.target.value
    setQuestions([...questions])
    setPosition(0)
  }

  const handleChangeType = (event, index) => {
    questions[index].type = event.target.value
    if (event.target.value === 'multiple') {
      questions[index].answers.push({
        title: '',
        position: 0
      })
      questions[index].answers.push({
        title: '',
        position: 1
      })
    } else {
      questions[index].answers = []
    }
    setQuestions([...questions])
    setPosition(0)
  }

  const handleChangeFormTitle = (event) => {
    questions.title = event.target.value
    setQuestions([...questions])
    setPosition(0)
  }

  const handleChangeAnswer = (event, index, index2) => {
    questions[index].answers[index2].title = event.target.value
    setQuestions([...questions])
    setPosition(0)
  }

  const handleAddAnswer = (index) => {
    questions[index].answers.push({
      title: '',
      position: questions[index].answers.length
    })
    setQuestions([...questions])
    setPosition(0)
  }

  const handleRemoveLastAnswer = (index) => {
    setQuestions(prevQuestion => {
      const newQuestion = [...prevQuestion]
      newQuestion[index].answers.pop()
      return newQuestion
    })
  }

  const handlePopup = () => {
    setIsOpen(!isOpen)
  }

  const handleGoBack = () => {
    window.location.href = '/questionnaires'
  }

  const buttonComponent = [
    {
      name: 'Valider le Questionnaire',
      function: postQuestions
    }
  ]

  return (
    <div className='form-page'>
      <div>
        <HeaderComp
          title={"Création d'un Nouveau Questionnaire"}
          withReturnBtn
          withLogo
          showButtons
          buttonComponent={buttonComponent}
          position={position}
          returnCall={handlePopup}
        />
      </div>
      <div className='form-container'>
        <Popup open={isOpen} onClose={() => setIsOpen(false)} modal>
          {(close) => (
            <div className='popup-modal-container'>
              <span className='title-popup'>Sauvegarder les Modifications ?</span>
              <span className='content-popup'>Vous êtes sur le point de quitter la page et vous avez des modifications en cours qui ne sont pas sauvegardées. En quittant sans sauvegarder, vous perdrez toute vos modifications.</span>
              {errMessage ? <span className='error-message' style={{ color: 'red' }}>{errMessage}</span> : ''}
              <div className='btn-container'>
                <button className='popup-btn' onClick={close}>Annuler</button>
                <div className='save-btn-container'>
                  <button className='popup-btn' style={{ backgroundColor: 'red', borderColor: 'red' }} onClick={handleGoBack}>Ne Pas Sauvegarder</button>
                  <button style={{ width: '150px' }} className='popup-btn' onClick={postQuestions}>Sauvegarder</button>
                </div>
              </div>
            </div>
          )}
        </Popup>
        <div className='form'>
          <div className='head-form'>
            <div className='input-container'>
              <input value={title} onChange={(e) => handleChangeFormTitle(e)} className='form-input default-input' name='form-title' id='form-title' placeholder='Titre du questionnaire' />
            </div>
            <div className='label-container'>
              <label id='parution-date-container' className='input-label'>
                <span className='label-content'>Date de parution</span>
                <DatePicker
                  className='default-input'
                  name='parution-date'
                  data-testid='parution-date'
                  id='parution-date'
                  selected={parutionDate}
                  onChange={date => /* istanbul ignore next */ { setParutionDate(date) }}
                  filterDate={filterMonday}
                />
              </label>
            </div>
          </div>
          <div className='error-message-container'>
            <p className='error-message' data-testid='error-message'>{errMessage}</p>
          </div>
        </div>
        <div className='form-content-container'>
          {
              (questionInc > 0 && questions) && questions.map((question, index) =>
                <div key={index} className='question'>
                  <div className='body'>
                    <div className='header'>
                      <label className='input-label'>
                        <span className='label-content'>{index + 1}.&nbsp;</span>
                        <input style={{ width: '700px' }} key={index} className='default-input' value={question.title} type='text' placeholder='Quelle est votre question ?' onChange={(e) => handleChangeTitle(e, index)} />
                      </label>
                      <label style={{ flexDirection: 'column' }} className='input-label'>
                        <span className='label-content'>Type de question</span>
                        <select data-testid={'select-' + index} style={{ width: '200px' }} className='default-input' key={index} value={question.type} onChange={(e) => handleChangeType(e, index)}>
                          <option value='text'>Texte</option>
                          <option value='emoji'>Émoticône</option>
                          <option value='multiple'>Multiple</option>
                        </select>
                      </label>
                    </div>
                    {
                      question.type === 'multiple' && (
                        <div className='body-content'>
                          <div className='answers'>
                            {question.answers.map((answer, index2) => (
                              <input key={index2} className='default-input' type='text' placeholder='Ajoutez une Réponse' defaultValue={answer.title} onChange={(e) => handleChangeAnswer(e, index, index2)} />
                            ))}
                          </div>
                          <div className='btn-container'>
                            <button className='form-btn' onClick={() => handleAddAnswer(index)}>Ajouter une Réponse</button>
                            {question.answers.length > 2 && <button className='form-btn' onClick={() => handleRemoveLastAnswer(index)}>Enlever la Dernière Réponse</button>}
                          </div>
                        </div>
                      )
                    }
                  </div>
                  {questionInc !== (index + 1) && <div className='horizontal-line' />}
                </div>
              )
            }
          <div className='confirmation-form-container'>
            <button className='form-btn' id='add-question-btn' onClick={handleAddNewQuestion}>Ajouter une Question</button>
            {(questionInc > 1) ? <button className='form-btn' id='remove-question-btn' onClick={handleRemoveLastQuestion}>Enlever la Dernière Question</button> : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModifyFormTeacherPage
