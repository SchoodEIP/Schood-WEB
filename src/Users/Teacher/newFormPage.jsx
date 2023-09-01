import React, { useState } from 'react';
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/formPage.scss'
import '../../css/Components/Buttons/questionnaireButtons.css'

const NewFormPage = () => {
  const [questionInc, setQuestionInc] = useState(0);
  const [idList, setIdList] = useState([]);

  function postQuestions() {
    const array = [];
    idList.forEach(id => {
      const question = document.getElementById('question-' + id).value;
      const type = document.getElementById('select-' + id).value;
      const qObject = {
        question: question,
        type: type,
      };
      array.push(qObject);
    });
    const title = document.getElementById('form-title').value;
    const date = document.getElementById('parution-date').value;
    const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire';

    try {
        fetch(questionnaireUrl, {
          method: 'POST',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: title,
            date: date,
            questions: array,
          })
        }).then(response => response.json())
          .then(data =>
            console.log(data.message))
          // .catch(error => setErrMessage(error.message))
      } catch (e) {
        // setErrMessage(e.message)
      }
  }

  function addNewQuestion() {

    const questionRow = document.getElementById('question-row');

    const container = document.createElement('div');
    container.id = 'container-' + questionInc;
    container.classList.add('questions-container');

    const num = idList.length;
    const numbering = document.createElement('h2');
    numbering.textContent = 'Question n° ' + (num + 1) + ' :';

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.id = 'question-' + questionInc;
    questionInput.placeholder = "Quelle est votre question ?";
    questionInput.classList.add('form-input');

    const typeSelect = document.createElement('select');
    typeSelect.id = 'select-' + questionInc;
    typeSelect.classList.add('pop-input');

    const textOption = document.createElement('option');
    textOption.value = "text";
    textOption.textContent = "Texte";

    const emojiOption = document.createElement('option');
    emojiOption.value = "emoji";
    emojiOption.textContent = "Emoticône";

    const multiOption = document.createElement('option');
    multiOption.value = "multiple";
    multiOption.textContent = "Multiple";

    const answerRow = document.createElement('div');
    answerRow.id = "answers-" + questionInc;

    container.appendChild(numbering);
    container.appendChild(questionInput);
    container.appendChild(typeSelect);
    typeSelect.appendChild(textOption);
    typeSelect.appendChild(emojiOption);
    typeSelect.appendChild(multiOption);
    container.appendChild(answerRow);
    questionRow.appendChild(container);
    setQuestionInc(questionInc + 1);
    setIdList(oldArray => [...oldArray, (questionInc)]);
  }

  function removeLastQuestion() {
    const questionRow = document.getElementById('question-row');

    const lastChild = questionRow.lastChild;
    if (lastChild) {
        questionRow.removeChild(lastChild);
    }
    setQuestionInc(questionInc - 1);
    setIdList(oldArray => {
      if (oldArray.length > 1) {
        return oldArray.slice(0, -1);
      }
    });
  }

  function QuestionRemovalButton(props) {
    if (props.shouldShowButton) {
      return (
        <button className="button-css questionnaire-btn" onClick={removeLastQuestion}>Enlever une Question</button>
      );
    } else {
      return null;
    }
  }

  return (
    <div className='form-page'>
      <div>
        <HeaderComp />
      </div>
      <div className='different-page-content' >
        <div>
          <Sidebar />
        </div>
        <div className='left-half'>
            <div className='form-container'>
                <div className='form-header'><h1 className='form-header-title'>Création de Questionnaire</h1></div>
                <div className='form-content-container'>
                    <div>
                        <input className='form-input' style={{width: '80%'}} name="form-title" id="form-title" placeholder='Titre du questionnaire'></input>
                    </div>
                    <div id='question-row'>
                    </div>
                    <div className='confirmation-form-container'>
                      <QuestionRemovalButton shouldShowButton={(questionInc > 1)}/>
                      <button className="button-css questionnaire-btn" onClick={addNewQuestion}>Ajouter une Question</button>
                    </div>
                    <div className='confirmation-form-container'>
                        <label id="parution-date-container">
                            Date de parution:
                            <input className='date-input' name="parution-date" id="parution-date" type='date'></input>
                        </label>
                        <button className="button-css questionnaire-btn" style={{alignSelf: "center", marginTop: "2.5rem"}} type='submit' onClick={postQuestions}>Créer un Questionnaire</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default NewFormPage;