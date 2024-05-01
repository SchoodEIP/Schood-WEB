import React, { useState, useEffect } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'

const NewFormPage = () => {
  const [questionInc, setQuestionInc] = useState(1)
  const [errMessage, setErrMessage] = useState('')
  const [questions, setQuestions] = useState([{
    title: "",
    type: 'text',
    answers: []
  }])

  function postQuestions () {
    const title = document.getElementById('form-title').value
    const date = document.getElementById('parution-date').value

    let proceed = true

    if (title !== "") {
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].title === "") {
          setErrMessage(`Question n°${i + 1} n'a pas été renseignée.`)
          proceed = false
          break;
        } else if (questions[i].type === 'multiple') {
          for (let j = 0; j < questions[i].answers.length; j++) {
            if (questions[i].answers[j].title === "") {
              proceed = false
              setErrMessage(`La réponse n°${j + 1} de la question n°${i + 1} n'a pas été renseignée.`)
              break
            }
          }
        }
      }
    } else {
      proceed = false
      setErrMessage(`Le questionnaire n'a pas de titre.`)
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
        if (response.status !== 200) {
          setErrMessage(response.status + ' error : ' + response.statusText)
        } else {
          window.location.href = '/questionnaires'
        }
      })
        .catch(error => setErrMessage(error.message))
    }
  }

  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const today = new Date()
    const daysUntilNextMonday = (1 - today.getDay() + 7) % 7
    const nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilNextMonday)
    setSelectedDate(nextMonday)
  }, [])

  const filterMonday = (date) => /* istanbul ignore next */ {
    return date.getDay() === 1 && date >= new Date()
  }

  const handleAddNewQuestion = () => {
    setQuestionInc(questionInc + 1)
    questions.push({
      title: "",
      type: 'text',
      answers: []
    })
    setQuestions(questions)
  }

  const handleRemoveLastQuestion = () => {
    setQuestionInc(questionInc - 1)
    setQuestions(prevQuestion => {
      const newQuestion = [...prevQuestion];
      newQuestion.pop();
      return newQuestion;
    });
  }

  const handleChangeTitle = (event, index) => {
    questions[index].title = event.target.value
    setQuestions([...questions]);
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
  }

  const handleChangeAnswer = (event, index, index2) => {
    questions[index].answers[index2].title = event.target.value
    setQuestions([...questions])
  }

  const handleAddAnswer = (index) => {
    questions[index].answers.push({
      title: '',
      position: questions[index].answers.length
    })
    setQuestions([...questions])
  }

  const handleRemoveLastAnswer = (index) => {
    setQuestions(prevQuestion => {
      const newQuestion = [...prevQuestion];
      newQuestion[index].answers.pop();
      return newQuestion;
    });
  }

  const buttonComponent = [
    {
      name: "Valider le Questionnaire",
      function: postQuestions
    }
  ]

  return (
    <div className='form-page'>
      <div>
        <HeaderComp
          title={"Création d'un Nouveau Questionnaire"}
          withReturnBtn={true}
          withLogo={true}
          showButtons={true}
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='form-container'>
        <div className='confirmation-form-container'>
          <input className='form-input default-input' name='form-title' id='form-title' placeholder='Titre du questionnaire' />
          <label id='parution-date-container' className="input-label">
            <span className="label-content">Date de parution</span>
            <DatePicker
              className='date-input default-input'
              name='parution-date'
              data-testid='parution-date'
              id='parution-date'
              selected={selectedDate}
              onChange={date => /* istanbul ignore next */ { setSelectedDate(date) }}
              filterDate={filterMonday}
            />
          </label>
          <div>
            <p className="error-message" data-testid='error-message'>{errMessage}</p>
          </div>
        </div>
        <div className='form-content-container'>
            {
              (questionInc > 0 && questions) && questions.map((question, index) =>
                <div key={index} className='question'>
                  <div className='body'>
                    <div className='header'>
                      <div className='left'>
                        {index + 1}.&nbsp;
                        <input key={index} className="default-input" defaultValue={question.title} type='text' placeholder="Quelle est votre question ?" onChange={(e) => handleChangeTitle(e, index)}/>
                      </div>
                      <div className='right'>
                        <label className="input-label">
                          <span className="label-content">Type de question</span>
                            <select key={index} className="default-input" defaultValue={question.type} onChange={(e) => handleChangeType(e, index)}>
                              <option value="text">Texte</option>
                              <option value="emoji">Émoticône</option>
                              <option value="multiple">Multiple</option>
                            </select>
                        </label>
                      </div>
                      {
                        question.type === 'multiple' && (
                          <div>
                            {question.answers.map((answer, index2) => (
                              <div key={index2}>
                                <label>
                                  <input type="text" placeholder="Ajoutez une Réponse" defaultValue={answer.title} onChange={(e) => handleChangeAnswer(e, index, index2)}/>
                                </label>
                              </div>
                            ))}
                            <div>
                              <button onClick={() => handleAddAnswer(index)}>Ajouter une Réponse</button>
                              {question.answers.length > 2 && <button onClick={() => handleRemoveLastAnswer(index)}>Enlever la Dernière Réponse</button>}
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              )
            }
          <div className='confirmation-form-container'>
            <button className='button-css questionnaire-btn' id='add-question-btn' onClick={handleAddNewQuestion}>Ajouter une Question</button>
            {(questionInc > 1) ? <button className='button-css questionnaire-btn' id='remove-question-btn' onClick={handleRemoveLastQuestion}>Enlever une Question</button> : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewFormPage
