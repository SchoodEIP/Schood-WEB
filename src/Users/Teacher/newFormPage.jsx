import React, { useState, useEffect } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import DatePicker from 'react-datepicker'
import Popup from 'reactjs-popup'
import '../../css/Components/Popup/popup.scss'
import 'react-datepicker/dist/react-datepicker.css'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import { disconnect } from '../../functions/disconnect'
import { toast } from 'react-toastify'

const NewFormPage = () => {
  const [questionInc, setQuestionInc] = useState(1)
  const [questions, setQuestions] = useState([{
    title: '',
    type: 'text',
    answers: []
  }])
  const [position, setPosition] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  function postQuestions () {
    const title = document.getElementById('form-title').value
    const date = document.getElementById('parution-date').value

    let proceed = true

    if (title !== '') {
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].title === '') {
          toast.error(`Question n°${i + 1} n'a pas été renseignée.`)
          proceed = false
          break
        } else if (questions[i].type === 'multiple') {
          for (let j = 0; j < questions[i].answers.length; j++) {
            if (questions[i].answers[j].title === '') {
              proceed = false
              toast.error(`La réponse n°${j + 1} de la question n°${i + 1} n'a pas été renseignée.`)
              break
            }
          }
        }
      }
    } else {
      proceed = false
      toast.error('Le questionnaire n\'a pas de titre.')
    }

    if (proceed) {
      fetch(process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire', {
        method: 'POST',
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
        }
        if (response.status !== 200) {
          toast.error(response.status + ' error : ' + response.statusText)
        } else {
          toast.success('Le questionnaire a été créé avec succès')
          window.location.href = '/questionnaires'
        }
      })
        .catch(error => toast.error(error.message))
    }
  }

  useEffect(() => {
    const today = new Date()
    const daysUntilNextMonday = (1 - today.getDay() + 7) % 7
    const nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilNextMonday)
    setSelectedDate(nextMonday)
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
      handleFunction: postQuestions
    }
  ]

  return (
    <div className='form-page'>
      <div>
        <HeaderComp
          title="Création d'un Nouveau Questionnaire"
          withReturnBtn
          withLogo
          showButtons
          buttonComponent={buttonComponent}
          position={position}
          returnCall={handlePopup}
        />
      </div>
      <div className='form-container'>
        <Popup contentStyle={{ width: '500px' }} open={isOpen} onClose={() => setIsOpen(false)} modal>
          {(close) => (
            <div style={{ maxWidth: '500px', height: '600px' }} className='popup-modal-container'>
              <span className='title-popup'>Sauvegarder les modifications ?</span>
              <span className='content-popup'>Vous êtes sur le point de quitter la page et vous avez des modifications en cours qui ne sont pas sauvegardées. En quittant sans sauvegarder, vous perdrez toutes vos modifications.</span>
              <div className='btn-container'>
                <div className='save-btn-container'>
                  <button className='popup-text-btn' onClick={close}>Continuer l'édition</button>
                  <button className='popup-btn' style={{ backgroundColor: 'red', borderColor: 'red' }} onClick={handleGoBack}>Quitter sans sauvegarder</button>
                  <button className='popup-btn' onClick={postQuestions}>Sauvegarder et quitter</button>
                </div>
              </div>
            </div>
          )}
        </Popup>
        <div className='form-content-container'>
          <div className='head-form'>
            <div className='input-container'>
              <span className='label-content'>Titre du questionnaire : </span>
              <input className='form-input default-input' name='form-title' id='form-title' placeholder='Titre du questionnaire' />
            </div>
            <div className='label-container'>
              <label id='parution-date-container' className='input-label'>
                <span className='label-content'>Date de parution : </span>
                <DatePicker
                  className='default-input'
                  name='parution-date'
                  data-testid='parution-date'
                  id='parution-date'
                  selected={selectedDate}
                  onChange={date => /* istanbul ignore next */ { setSelectedDate(date) }}
                  filterDate={filterMonday}
                />
              </label>
            </div>
          </div>
          {
              (questionInc > 0 && questions) && questions.map((question, index) =>
                <div key={index} className='question'>
                  <div className='body'>
                    <div className='header'>
                      <label className='input-label'>
                        <span className='label-content'>{index + 1}.&nbsp;</span>
                        <input style={{ width: '700px' }} key={index} className='default-input' defaultValue={question.title} type='text' placeholder='Quelle est votre question ?' onChange={(e) => handleChangeTitle(e, index)} />
                      </label>
                      <label style={{ flexDirection: 'column' }} className='input-label'>
                        <span className='label-content'>Type de question</span>
                        <select data-testid={'select-' + index} style={{ width: '200px' }} className='default-select' key={index} defaultValue={question.type} onChange={(e) => handleChangeType(e, index)}>
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
                            <button className='form-btn' onClick={() => handleAddAnswer(index)}>+ Ajouter une Réponse</button>
                            {question.answers.length > 2 && <button className='form-btn' onClick={() => handleRemoveLastAnswer(index)}>- Enlever la Dernière Réponse</button>}
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
            <button className='form-btn' id='add-question-btn' onClick={handleAddNewQuestion}>+ Ajouter une Question</button>
            {(questionInc > 1) ? <button className='form-btn' id='remove-question-btn' onClick={handleRemoveLastQuestion}>- Enlever la Dernière Question</button> : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewFormPage
