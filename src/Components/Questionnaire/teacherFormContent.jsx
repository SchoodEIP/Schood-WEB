import React, { useEffect, useState } from 'react'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import '../../css/pages/formDetailPage.scss'

import arrow from '../../assets/rightArrow2.png'

import emoji1 from '../../assets/emojis/1.png'
import emoji2 from '../../assets/emojis/2.png'
import emoji3 from '../../assets/emojis/3.png'
import emoji4 from '../../assets/emojis/4.png'
import emoji5 from '../../assets/emojis/5.png'

const TeacherFormContent = (props) => {
  const imgImports = [emoji1, emoji2, emoji3, emoji4, emoji5]
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    setQuestions(props.form.questions)
  }, [props.form.questions])

  const setAccordion = (question) => {
    question.active = !question.active
    setQuestions([...questions])
  }

  return (
    <div className='teacher-content'>
      {(!props.form | !questions)
        ? <div style={{ color: 'red', fontFamily: 'Inter' }}>{props.error}</div>
        : questions.map((question, index) => (
          <div key={index} className='question'>
            <div className='body'>
              <div data-testid={`question-container-${index}`} className='header' onClick={() => setAccordion(question)}>
                <div className='left'>
                  <div className='nb-question'>
                    {index + 1}.&nbsp;
                  </div>
                  <div className='title-question'>
                    {question.title}
                  </div>
                </div>
                <div className={(question.active ? 'up-arrow' : 'down-arrow')}>
                  <img src={arrow} alt='arrow' />
                </div>
              </div>
              <div className='details' data-testid={'answers-' + index}>
                {question.type === 'text' && (
                  <ul className='text-list' style={question.active ? { display: 'flex' } : { display: 'none' }}>
                    {question.answers.map((answer, answerIndex) => (
                      <li style={{ listStyle: 'none' }} key={answerIndex}>{answer}</li>
                    ))}
                  </ul>
                )}
                {question.type === 'emoji' && (
                  <div style={question.active ? { display: 'flex' } : { display: 'none' }} className='emoji-row'>
                    {imgImports.map((imgSrc, i) => (
                      <div key={i} className='emoji-container'>
                        <img style={{ width: '50px' }} src={imgSrc} alt={imgSrc} />
                        <div className='percentage-container'>
                          <span className='emoji-text' data-testid={`emoji-answer-${i}`}>{question.answers[i]?.count ? question.answers[i]?.count : 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {question.type === 'multiple' && (
                  <ul className='multiple'>
                    {question.answers.map((answer, i) => (
                      <li className='answer' style={question.active ? { display: 'flex', gap: '25px' } : { display: 'none' }} key={i}>
                        <span style={{ listStyle: 'none' }}>{answer.title}</span>
                        <div className='percentage-container'>
                          <span data-testid={`multiple-answer-${i}`}>{answer.count}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {(index !== (questions.length - 1)) ? <span className='divider' /> : ''}
          </div>
        ))}
    </div>
  )
}

export default TeacherFormContent
