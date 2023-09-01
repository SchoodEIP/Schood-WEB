import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/Sidebar/sidebar'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/pages/formPage.scss'

const NewFormPage = () => {
  const [questionInc, setQuestionInc] = useState(0);
  const [idList, setIdList] = useState([0]);

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
            questions: array
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
    setIdList(oldArray => [...oldArray, (questionInc + 1)]);

    const questionRow = document.getElementById('question-row');

    const container = document.createElement('div');
    container.id = 'container-' + (questionInc + 1);

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.id = 'question-' + (questionInc + 1);
    questionInput.placeholder = "Quelle est votre question ?";

    const typeSelect = document.createElement('select');
    typeSelect.id = 'select-' + (questionInc + 1);

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
    answerRow.id = "answers-" + (questionInc + 1);

    container.appendChild(questionInput);
    container.appendChild(typeSelect);
    typeSelect.appendChild(textOption);
    typeSelect.appendChild(emojiOption);
    typeSelect.appendChild(multiOption);
    container.appendChild(answerRow);
    questionRow.appendChild(container);
    setQuestionInc(questionInc + 1);
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
                        <input className='form-title-input' name="form-title" id="form-title" placeholder='Titre du questionnaire'></input>
                    </div>
                    <div className='questions-container' id='question-row'>
                      <input id="question-0" type="text" placeholder='Quelle est votre question ?'></input>
                      <select id="select-0">
                        <option value="text">Texte</option>
                        <option value='emoji'>Emoticône</option>
                        <option value="multiple">Multiple</option>
                      </select>
                    </div>
                    <div>
                      <button onClick={addNewQuestion}>Ajouter une Question</button>
                    </div>
                    <div>
                        <label>
                            Date de parution:
                            <input name="parution-date" id="parution-date" type='date'></input>
                        </label>
                        <button type='submit' onClick={postQuestions}>Créer un Questionnaire</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default NewFormPage;