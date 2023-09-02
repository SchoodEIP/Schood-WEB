import React, { useEffect } from 'react'
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'
import IconFace0 from '../../assets/icon_face_0.png'
import IconFace1 from '../../assets/icon_face_1.png'
import IconFace2 from '../../assets/icon_face_2.png'
import { useParams } from 'react-router-dom'

const FormStudentPage = () => {
  const {id} = useParams()
  console.log(id)
  // create questionnaire on load
  useEffect(() => {
    const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire/' + id
    const imgImports = [IconFace0, IconFace1, IconFace2];
    const exemple = {
        _id: "64f2f862b0975ae4340acafa",
        classes: [
          {
            _id: "64f2f829b0975ae4340acad6",
            name: "200"
          },
          {
          _id: "64f2f829b0975ae4340acad7",
          name: "201"
        }],
        createdBy: {
          _id: "64f2f829b0975ae4340acae4",
          email: "teacher1@schood.fr",
          firstname: "teacher1",
          lastname: "teacher1"
        },
        questions: [
          {
            title: 'is this a test ?',
            type: 'emoji',
            answers: []
          },
          {
            title: 'what do you want ?',
            type: 'text',
            answers: []
          },
          {
            title: 'How do you feel ?',
            type: 'multiple',
            answers: ['sad', 'normal', 'happy']
          }
        ],
        fromDate: "2023-08-27T00:00:00.000Z",
        title: "Test",
        toDate: "2023-09-02T00:00:00.000Z"
      };
    try {
      fetch(questionnaireUrl, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(data => {
          console.log(data)
          const titleContainer = document.getElementById('title-container');

          const formTitle = document.createElement('h1');
          formTitle.classList.add("form-header-title");
          formTitle.innerText = data.title;
          titleContainer.appendChild(formTitle);

          data.questions.forEach((question, index) => {
            const questionRow = document.getElementById('question-row')

            const container = document.createElement('div')
            container.id = 'container-' + index
            container.classList.add('questions-container')

            const questionContainer = document.createElement('div')
            questionContainer.id = 'question-container-' + index
            questionContainer.classList.add("question-container")

            const questionText = document.createElement('h2')
            questionText.innerText = (index + 1) + '. ' + question.title

            const answerRow = document.createElement('div')
            answerRow.id = 'answers-' + index
            answerRow.classList.add('answer-row')

            switch (question.type) {
              case 'text':
                  const textAnswer = document.createElement('textArea');
                  textAnswer.id = 'answer-' + index + '-0'
                  textAnswer.classList.add('answer-text')
                  answerRow.appendChild(textAnswer)
                break;
              case 'emoji':
                  const emojiRow = document.createElement('div');
                  emojiRow.classList.add('emoji-row')
                  answerRow.appendChild(emojiRow)

                  for (let i = 0; i < 3; i++) {
                    const emojiContainer = document.createElement('div');
                    emojiContainer.classList.add('emoji-container')
                    emojiRow.appendChild(emojiContainer)

                    const emojiImg = document.createElement('img')
                    emojiImg.src = imgImports[i]
                    emojiContainer.appendChild(emojiImg)

                    const emojiInput = document.createElement('input')
                    emojiInput.type = "checkbox"
                    emojiInput.id = "answer-" + index + "-" + i
                    emojiContainer.appendChild(emojiInput)
                  }
                break;
                case 'multiple':
                  const ul = document.createElement('ul');
                  answerRow.appendChild(ul);
                  for (let i = 0; i < question.answers.length; i++) {
                    const li = document.createElement('li');
                    li.style.gap = "25px"
                    li.style.display = "flex"
                    ul.appendChild(li);

                    const multipleInput = document.createElement('input')
                    multipleInput.type = "checkbox"
                    multipleInput.id = "answer-" + index + "-" + i
                    li.appendChild(multipleInput)

                    const multipleText = document.createElement('span')
                    multipleText.textContent = question.answers[i]
                    li.style.listStyle = "none"
                    li.appendChild(multipleText)
                  }
                break;
              default:
                break;
            }

            container.appendChild(questionContainer)
            questionContainer.appendChild(questionText)
            container.appendChild(answerRow)
            questionRow.appendChild(container)
          })
        })
        .catch(error => console.error(error.message))
    } catch (e) {
      console.error(e.message)
    }
  }, [])

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
            <div className='form-header' id="title-container">
              <h1 className='form-header-title' id="form-header-title"></h1>
            </div>
            <div className='form-content-container'>
              <div id="question-row"></div>
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
