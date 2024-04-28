import React, { useEffect, useState } from 'react'
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import moment from 'moment'
import '../../css/pages/formDetailPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import { useNavigate, useParams } from 'react-router-dom'

import arrow from "../../assets/rightArrow2.png" 

import emoji1 from "../../assets/emojis/1.png" 
import emoji2 from "../../assets/emojis/2.png" 
import emoji3 from "../../assets/emojis/3.png" 
import emoji4 from "../../assets/emojis/4.png" 
import emoji5 from "../../assets/emojis/5.png"

import emoji1Selected from "../../assets/emojis/1s.png" 
import emoji2Selected from "../../assets/emojis/2s.png" 
import emoji3Selected from "../../assets/emojis/3s.png" 
import emoji4Selected from "../../assets/emojis/4s.png" 
import emoji5Selected from "../../assets/emojis/5s.png" 
import { toast } from 'react-toastify'

const FormStudentPage = () => {
  const { id } = useParams()
  const [data, setData] = useState({})
  const [error, setError] = useState(null)
  const [currentCheck, setCurrentCheck] = useState(false)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const navigate = useNavigate()
  const [isAnswered, setIsAnswered] = useState(false)

  const formatQuestions = (dataQ, data2) => {
    const result = []

    setQuestions([])

    dataQ.questions.forEach(question => {
      let tmp = JSON.parse(JSON.stringify(question))
      tmp.active = false;

      if (data2 && data2.answers && data2.answers.length > 0) {
        let found = false;
        data2.answers.forEach(answer => {
          if (String(answer.question) === String(question._id)) {
            tmp.studentAnswer = JSON.parse(JSON.stringify(answer.answers))
            found = true;
          }
        });

        if (!found) {
          tmp.studentAnswer = [""]
        }
      } else {
        tmp.studentAnswer = [""]
      }

      result.push(tmp)
    });

    setQuestions(result)
  }

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

  const getQuestionnaireAnswers = (data) => {
    const getAnswersUrl = process.env.REACT_APP_BACKEND_URL + '/student/questionnaire/' + id

    fetch(getAnswersUrl, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(data2 => {
        console.log("data2b:", data2)
        if (data2 !== null) {
          setIsAnswered(true)
          setAnswers(data.answers)
        }
        formatQuestions(data, data2)
      })
      .catch(error => /* istanbul ignore next */ toast.error("Erreur Serveur. Veuillez réessayer plus tard."))
  }

  const getQuestionnaireData = () => {
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
          getQuestionnaireAnswers(data)
        } else /* istanbul ignore next */ {
          toast.error(data.message)
        }
      })
      .catch(error => /* istanbul ignore next */ toast.error("Erreur Serveur. Veuillez réessayer plus tard."))
  }

  useEffect(() => {
    setData({})
    setQuestions([])
    setAnswers([])
    getQuestionnaireData();
  }, [])

  function getFormAnswers () {
    const formAnswers = []

    questions.forEach((question, index) => {
      console.log("question: ", question)
      let result = {
        question: question._id,
        answers: question.studentAnswer.filter((answer) => answer && answer.length > 0)
      }

      if (result.answers.length > 0 && result.answers[0] !== "") {
        formAnswers.push(result)
      }
    });
    
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
        toast.success("Réponses enregistrées avec succès.")
        if (!data.message) {
          setIsAnswered(true)
          navigate('/questionnaires')
        } else /* istanbul ignore next */ {
          toast.error(data.message)
        }
      })
      .catch(error => /* istanbul ignore next */ toast.error("Erreur Serveur. Veuillez réessayer plus tard."))
  }

  const setAccordion = (question) => {
    question.active = !question.active
    setQuestions([...questions])
  }

  const setValueTextArea = (value, index) => {
    questions[index].studentAnswer[0] = value.target.value
    setQuestions([...questions])
  }

  const handleClickEmoji = (number, index) => {
    if (!currentCheck) {
      questions[index].studentAnswer[0] = number
      setQuestions([...questions])
    }
  }

  const setCheckbox = (index, index2) => {
    if (questions[index].studentAnswer.includes(questions[index].answers[index2].title)) {
      questions[index].studentAnswer.splice(questions[index].studentAnswer.findIndex((answer) => answer === questions[index].answers[index2].title), 1)
    } else {
      questions[index].studentAnswer.push(questions[index].answers[index2].title)
    }
    setQuestions([...questions])
  }

  return (
    <div className='form-detail-page'>
      <div className='header'>
        <HeaderComp 
          title={data.title}
          subtitle={`Du ${moment(data.fromDate).format('DD/MM/YYYY')} au ${moment(data.toDate).format('DD/MM/YYYY')}`}
          withReturnBtn={true}
          withLogo={true}
        />
      </div>
      <div className='content'>
        {questions.length > 0 && questions.map((question, index) => (
          <div key={index} className='question'>
            <div className='body'>
              <div className='header' onClick={() => setAccordion(question)}>
                <div className='left'>
                  <div className='nb-question'>
                    {index + 1}.&nbsp;
                  </div>
                  <div className='title-question'>
                    {question.title}
                  </div>
                </div>
                <div className={(question.active ? 'up-arrow' : 'down-arrow')}>
                  <img src={arrow} alt='arrow'/>
                </div>
              </div>
              {question.active && (
                <div className='details'>
                  {question.type === "text" && (
                    <div className='text'>
                      <textarea id={`text-${index}`} disabled={currentCheck} cols="30" rows="10" defaultValue={question.studentAnswer[0]} onChange={(event) => setValueTextArea(event, index)}/>
                    </div>
                  )}

                  {question.type === "emoji" && (
                    <div className='emoji'>
                      <img alt='emoji1' src={question.studentAnswer[0] === "0" ? emoji1Selected : emoji1} onClick={() => handleClickEmoji("0", index)} />
                      <img alt='emoji2' src={question.studentAnswer[0] === "1" ? emoji2Selected : emoji2} onClick={() => handleClickEmoji("1", index)}/>
                      <img alt='emoji3' src={question.studentAnswer[0] === "2" ? emoji3Selected : emoji3} onClick={() => handleClickEmoji("2", index)}/>
                      <img alt='emoji4' src={question.studentAnswer[0] === "3" ? emoji4Selected : emoji4} onClick={() => handleClickEmoji("3", index)}/>
                      <img alt='emoji5' src={question.studentAnswer[0] === "4" ? emoji5Selected : emoji5} onClick={() => handleClickEmoji("4", index)}/>
                    </div>
                  )}

                  {question.type === "multiple" && (
                    <div className='multiple'>
                      {question.answers.map((answer, index2) => (
                        <div key={index2} className='answer'>
                          <input disabled={currentCheck} type='checkbox' checked={question.studentAnswer.includes(answer.title)} onChange={() => setCheckbox(index, index2)}/>{answer.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className='divider'></span>
          </div>
        ))}
      </div>
      {!currentCheck && (
        <div className='submit'>
          <button onClick={sendAnswers} type='submit' >Envoyer le questionnaire</button>
        </div>
      )}
    </div>
  )
}

export default FormStudentPage
