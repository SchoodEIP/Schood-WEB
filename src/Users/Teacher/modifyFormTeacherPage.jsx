import React, { useState, useEffect } from 'react'
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const ModifyFormTeacherPage = () => {
  const [questionInc, setQuestionInc] = useState(0)
  const [errMessage, setErrMessage] = useState('')
  const [parutionDate, setParutionDate] = useState('')
  const { id } = useParams()

  useEffect(() => {
    function addNewQuestion (type) {
      const questionRow = document.getElementById('question-row')
      const numQ = questionRow.querySelectorAll('[placeholder="Quelle est votre question ?"]').length

      const container = document.createElement('div')
      container.id = 'container-' + numQ
      container.classList.add('questions-container')

      const numbering = document.createElement('h2')
      numbering.textContent = 'Question n° ' + (numQ + 1) + ' :'

      const questionInput = document.createElement('input')
      questionInput.type = 'text'
      questionInput.id = 'question-' + numQ
      questionInput.placeholder = 'Quelle est votre question ?'
      questionInput.classList.add('form-input')

      const typeSelect = document.createElement('select')
      typeSelect.id = 'select-' + numQ
      typeSelect.setAttribute('data-testId', 'select-' + numQ)
      typeSelect.addEventListener('change', function () {
        changeAnswerBtnStatus(numQ)
      })
      typeSelect.classList.add('pop-input')

      const textOption = document.createElement('option')
      textOption.value = 'text'
      textOption.textContent = 'Texte'

      const emojiOption = document.createElement('option')
      emojiOption.value = 'emoji'
      emojiOption.textContent = 'Emoticône'

      const multiOption = document.createElement('option')
      multiOption.value = 'multiple'
      multiOption.textContent = 'Multiple'

      const answerRow = document.createElement('div')
      answerRow.id = 'answer-row-' + numQ
      answerRow.setAttribute('data-testId', 'answer-row-' + numQ)
      answerRow.classList.add('answer-row')
      answerRow.classList.add('new-answer-row')

      const answerBtnContainer = document.createElement('div')
      answerBtnContainer.id = 'answer-btn-container-' + numQ
      answerBtnContainer.classList.add('confirmation-form-container')
      answerBtnContainer.style.display = 'none'

      const removeAnswerBtn = document.createElement('button')
      removeAnswerBtn.textContent = 'Enlever une Réponse'
      removeAnswerBtn.id = 'remove-answer-btn-' + numQ
      removeAnswerBtn.classList.add('button-css')
      removeAnswerBtn.classList.add('questionnaire-btn')
      removeAnswerBtn.style.display = 'none'
      removeAnswerBtn.addEventListener('click', function () {
        removeAnswer(numQ)
      })

      const addAnswerBtn = document.createElement('button')
      addAnswerBtn.textContent = 'Ajouter une Réponse'
      addAnswerBtn.id = 'add-answer-btn-' + numQ
      addAnswerBtn.classList.add('button-css')
      addAnswerBtn.classList.add('questionnaire-btn')
      addAnswerBtn.addEventListener('click', function () {
        addAnswer(numQ)
      })

      container.appendChild(numbering)
      container.appendChild(questionInput)
      container.appendChild(typeSelect)
      typeSelect.appendChild(textOption)
      typeSelect.appendChild(emojiOption)
      typeSelect.appendChild(multiOption)
      container.appendChild(answerRow)
      container.appendChild(answerBtnContainer)
      answerBtnContainer.appendChild(addAnswerBtn)
      answerBtnContainer.appendChild(removeAnswerBtn)
      questionRow.appendChild(container)
      setQuestionInc(numQ + 1)
    }

    function addNewAnswer (id) {
      const answerRow = document.getElementById('answer-row-' + id)
      const allAnswers = answerRow.querySelectorAll('input')

      if (allAnswers.length === 2) {
        const removeAnswerBtn = document.getElementById('remove-answer-btn-' + id)
        removeAnswerBtn.style.display = 'block'
      }
      const answerInput = document.createElement('input')
      answerInput.classList.add('form-input')
      answerInput.id = 'form-input-' + id + '-' + allAnswers.length
      answerInput.placeholder = 'Choix possible'
      answerRow.appendChild(answerInput)
    }

    function fillForm (dataset) {
      document.getElementById('form-title').value = dataset.title
      dataset.questions.map((question, index) => {
        addNewQuestion(question.type)
        document.getElementById('question-' + index).value = question.title
        document.getElementById('select-' + index).value = question.type
        if (question.type === 'multiple') {
          question.answers.map((answer, i) => {
            addNewAnswer(index)
            document.getElementById('form-input-' + index + '-' + i).value = answer.title
            return null
          })
          const answerBtnContainer = document.getElementById('answer-btn-container-' + index)
          answerBtnContainer.style.display = 'block'
        }
        return null
      })
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
          fillForm(data)
          setParutionDate(moment(data.fromDate).format('YYYY-MM-DD'))
        } else {
          setErrMessage(data.message)
        }
      })
      .catch(error => /* istanbul ignore next */ { setErrMessage(error.message) })
  }, [id])

  function postQuestions () {
    const array = []
    for (let i = 0; i < questionInc; i++) {
      const question = document.getElementById('question-' + i).value
      const type = document.getElementById('select-' + i).value
      const answerRow = document.getElementById('answer-row-' + i)
      const allAnswers = answerRow.querySelectorAll('input')
      const answers = []
      for (let j = 0; j < allAnswers.length; j++) {
        const answer = {
          title: allAnswers[j].value,
          position: j
        }
        answers.push(answer)
      }
      const qObject = {
        title: question,
        type,
        answers
      }
      array.push(qObject)
    }
    const title = document.getElementById('form-title').value
    const date = document.getElementById('parution-date').value
    const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire/' + id

    fetch(questionnaireUrl, {
      method: 'PATCH',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        date,
        questions: array
      })
    }).then(response => {
      if (response.status !== 200) {
        setErrMessage(response.status + ' error : ' + response.statusText)
      } else {
        window.location.href = '/questionnaire/' + id
      }
    })
      .catch(error => /* istanbul ignore next */ { setErrMessage(error.message) })
  }

  function changeAnswerBtnStatus (id) {
    const answerSelect = document.getElementById('select-' + id)
    const answerRow = document.getElementById('answer-row-' + id)
    const answerBtnContainer = document.getElementById('answer-btn-container-' + id)
    const removeAnswerBtn = document.getElementById('remove-answer-btn-' + id)

    if (answerSelect.value !== 'multiple') {
      answerRow.innerHTML = ''
      answerBtnContainer.style.display = 'none'
      removeAnswerBtn.style.display = 'none'
    } else {
      answerBtnContainer.style.display = 'flex'
      for (let i = 0; i < 2; i++) {
        const firstAnswerInput = document.createElement('input')
        firstAnswerInput.classList.add('form-input')
        firstAnswerInput.id = 'form-input-' + id + '-' + i
        firstAnswerInput.placeholder = 'Choix possible'
        answerRow.appendChild(firstAnswerInput)
      }
    }
  }

  function addAnswer (id) {
    const answerRow = document.getElementById('answer-row-' + id)
    const allAnswers = answerRow.querySelectorAll('input')

    if (allAnswers.length === 2) {
      const removeAnswerBtn = document.getElementById('remove-answer-btn-' + id)
      removeAnswerBtn.style.display = 'block'
    }
    const answerInput = document.createElement('input')
    answerInput.classList.add('form-input')
    answerInput.id = 'form-input-' + id + '-' + allAnswers.length
    answerInput.placeholder = 'Choix possible'
    answerRow.appendChild(answerInput)
  }

  function removeAnswer (id) {
    const answerRow = document.getElementById('answer-row-' + id)
    const allAnswers = answerRow.querySelectorAll('input')

    if (allAnswers.length === 3) {
      const removeAnswerBtn = document.getElementById('remove-answer-btn-' + id)
      removeAnswerBtn.style.display = 'none'
    }
    answerRow.removeChild(allAnswers[allAnswers.length - 1])
  }

  function addNewQuestion () {
    const questionRow = document.getElementById('question-row')
    const numQ = questionRow.querySelectorAll('[placeholder="Quelle est votre question ?"]').length

    const container = document.createElement('div')
    container.id = 'container-' + numQ
    container.classList.add('questions-container')

    const numbering = document.createElement('h2')
    numbering.textContent = 'Question n° ' + (numQ + 1) + ' :'

    const questionInput = document.createElement('input')
    questionInput.type = 'text'
    questionInput.id = 'question-' + numQ
    questionInput.placeholder = 'Quelle est votre question ?'
    questionInput.classList.add('form-input')

    const typeSelect = document.createElement('select')
    typeSelect.id = 'select-' + numQ
    typeSelect.setAttribute('data-testId', 'select-' + numQ)
    typeSelect.addEventListener('change', function () {
      changeAnswerBtnStatus(numQ)
    })
    typeSelect.classList.add('pop-input')

    const textOption = document.createElement('option')
    textOption.value = 'text'
    textOption.textContent = 'Texte'

    const emojiOption = document.createElement('option')
    emojiOption.value = 'emoji'
    emojiOption.textContent = 'Emoticône'

    const multiOption = document.createElement('option')
    multiOption.value = 'multiple'
    multiOption.textContent = 'Multiple'

    const answerRow = document.createElement('div')
    answerRow.id = 'answer-row-' + numQ
    answerRow.setAttribute('data-testId', 'answer-row-' + numQ)
    answerRow.classList.add('answer-row')
    answerRow.classList.add('new-answer-row')

    const answerBtnContainer = document.createElement('div')
    answerBtnContainer.id = 'answer-btn-container-' + numQ
    answerBtnContainer.classList.add('confirmation-form-container')
    answerBtnContainer.style.display = 'none'

    const removeAnswerBtn = document.createElement('button')
    removeAnswerBtn.textContent = 'Enlever une Réponse'
    removeAnswerBtn.id = 'remove-answer-btn-' + numQ
    removeAnswerBtn.classList.add('button-css')
    removeAnswerBtn.classList.add('questionnaire-btn')
    removeAnswerBtn.style.display = 'none'
    removeAnswerBtn.addEventListener('click', function () {
      removeAnswer(numQ)
    })

    const addAnswerBtn = document.createElement('button')
    addAnswerBtn.textContent = 'Ajouter une Réponse'
    addAnswerBtn.id = 'add-answer-btn-' + numQ
    addAnswerBtn.classList.add('button-css')
    addAnswerBtn.classList.add('questionnaire-btn')
    addAnswerBtn.addEventListener('click', function () {
      addAnswer(numQ)
    })

    setQuestionInc(numQ + 1)

    container.appendChild(numbering)
    container.appendChild(questionInput)
    container.appendChild(typeSelect)
    typeSelect.appendChild(textOption)
    typeSelect.appendChild(emojiOption)
    typeSelect.appendChild(multiOption)
    container.appendChild(answerRow)
    container.appendChild(answerBtnContainer)
    answerBtnContainer.appendChild(addAnswerBtn)
    answerBtnContainer.appendChild(removeAnswerBtn)
    questionRow.appendChild(container)
  }

  function removeLastQuestion () {
    setQuestionInc(questionInc - 1)
    const questionRow = document.getElementById('question-row')

    const lastChild = questionRow.lastChild
    if (lastChild) {
      questionRow.removeChild(lastChild)
    }
  }

  useEffect(() => {
    const today = new Date()
    const daysUntilNextMonday = (1 - today.getDay() + 7) % 7
    const nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilNextMonday)
    setParutionDate(nextMonday)
  }, [])

  const filterMonday = (date) => /* istanbul ignore next */ {
    return date.getDay() === 1 && date >= new Date()
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
            <div className='form-header'><h1 className='form-header-title'>Modification de Questionnaire</h1></div>
            <div className='form-content-container'>
              <div>
                <input className='form-input' style={{ width: '80%' }} name='form-title' id='form-title' placeholder='Titre du questionnaire' />
              </div>
              <div id='question-row' />
              <div className='confirmation-form-container'>
                <button className='button-css questionnaire-btn' id='add-question-btn' onClick={addNewQuestion}>Ajouter une Question</button>
                {(questionInc > 1) ? <button className='button-css questionnaire-btn' id='remove-question-btn' onClick={removeLastQuestion}>Enlever une Question</button> : ''}
              </div>
              <div className='confirmation-form-container'>
                <label id='parution-date-container'>
                  Date de parution:
                  <DatePicker
                    className='date-input'
                    name='parution-date'
                    data-testid='parution-date'
                    id='parution-date'
                    selected={parutionDate}
                    onChange={date => /* istanbul ignore next */ { setParutionDate(date) }}
                    filterDate={filterMonday}
                  />
                </label>
                <div style={{}}>
                  <p data-testid='error-message'>{errMessage}</p>
                  <button className='button-css questionnaire-btn' id='new-form-btn' style={{ alignSelf: 'center', marginTop: '2.5rem' }} onClick={postQuestions}>Modifier le Questionnaire</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModifyFormTeacherPage
