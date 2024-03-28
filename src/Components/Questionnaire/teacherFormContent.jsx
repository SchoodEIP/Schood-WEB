import ArrowUp from '../../assets/up_arrow_icon.png'
import ArrowDown from '../../assets/down_arrow_icon.png'
import React from 'react'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import IconFace0 from '../../assets/icon_face_0.png'
import IconFace1 from '../../assets/icon_face_1.png'
import IconFace2 from '../../assets/icon_face_2.png'

const TeacherFormContent = (props) => {
  const imgImports = [IconFace0, IconFace1, IconFace2]

  const handleHideResult = (index) => {
    const answer = document.getElementById('answers-' + index)
    const arrow = document.getElementById('extend-retract-' + index)

    if (answer.style.display === 'none') {
      answer.style.display = 'flex'
      arrow.src = ArrowDown
    } else {
      answer.style.display = 'none'
      arrow.src = ArrowUp
    }
  }

  return (
    <div>
      {(!props.form | !props.form.questions)
        ? <div>{props.error}</div>
        : props.form.questions.map((question, index) => (
          <div
            key={index}
            className='questions-container'
            id={`container-${index}`}
            onClick={(question.type === 'text') ? () => handleHideResult(`${index}`) : null}
          >
            <div
              className='question-container'
              style={{ cursor: 'pointer' }}
              data-testid={`question-container-${index}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }} id='question-row'>
                <h2>{`${index + 1}. ${question.title}`}</h2>
                {(question.type === 'text') ? <img style={{ width: '75px' }} id={'extend-retract-' + index} src={ArrowDown} alt={ArrowDown} /> : ''}
              </div>
            </div>

            <div className='answer-row' id={'answers-' + index}>
              {question.type === 'text' && (
                <ul>
                  {question.answers.map((answer, answerIndex) => (
                    <li key={answerIndex}>{answer}</li>
                  ))}
                </ul>
              )}
              {question.type === 'emoji' && (
                <div className='emoji-row'>
                  {imgImports.map((imgSrc, i) => (
                    <div key={i} className='emoji-container'>
                        <img style={{ width: '50px' }} src={imgSrc} alt={imgSrc} />
                        <p data-testid={`emoji-answer-${i}`}>{question.answers[i]?.count}</p>
                      </div>
                  ))}
                </div>
              )}
              {question.type === 'multiple' && (
                <ul>
                  {question.answers.map((answer, i) => (
                    <li key={i} style={{ gap: '25px', display: 'flex' }}>
                        <span style={{ listStyle: 'none' }}>{answer.title}</span>
                        <span data-testid={`multiple-answer-${i}`}>{answer.count}</span>
                      </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
    </div>
  )
}

export default TeacherFormContent
