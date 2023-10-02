import React, { useEffect, useState } from 'react';
import '../../css/Components/Questionnaire/questSpace.css';

export function QuestSpace() {
  const [previousQuestStatus, setPreviousQuestStatus] = useState(''); // Statut du questionnaire précédent
  const [currentQuestStatus, setCurrentQuestStatus] = useState(''); // Statut du questionnaire hebdomadaire

  useEffect(() => {
    // Effectuer une requête GET pour récupérer le statut du questionnaire précédent
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/previous`)
      .then((response) => response.json())
      .then((data) => {
        setPreviousQuestStatus(data.status);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du statut du questionnaire précédent :', error);
      });

    // Effectuer une requête GET pour récupérer le statut du questionnaire hebdomadaire
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/current`)
      .then((response) => response.json())
      .then((data) => {
        setCurrentQuestStatus(data.status);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du statut du questionnaire hebdomadaire :', error);
      });
  }, []);

  return (
    <div data-testid="quest-space" className='quest-box'>
      <div className='quest-header'>
        <p className='title'>Mes Questionnaires</p>
      </div>
      <div className='quest-body'>
        <div className='quest-content'>
          <div className='quest-previous'>
            <p>Questionnaire précédent</p>
            {previousQuestStatus === 'not_started' && (
              <div className='quest-start'>
                <button className='green-button' onClick={() => window.location.href = '/questionnaires'}>
                  Lancer le questionnaire
                </button>
              </div>
            )}
            {previousQuestStatus === 'in_progress' && (
              <div className='quest-start'>
                Ce questionnaire a été commencé.
              </div>
            )}
            {previousQuestStatus === 'completed' && (
              <div data-testid="previous-quest-status" className='quest-start'>
                Ce questionnaire est fini.
              </div>
            )}
            {previousQuestStatus === 'completed' && (
              <div className='quest-terminate'>
                <button className='orange-button' onClick={() => window.location.href = '/questionnaires'}>
                  Terminer le questionnaire
                </button>
              </div>
            )}
          </div>
          <div className='quest-current'>
            <p>Questionnaire hebdomadaire</p>
            {currentQuestStatus === 'not_started' && (
              <div className='quest-start'>
                <button className='green-button' onClick={() => window.location.href = '/questionnaires'}>
                  Lancer le questionnaire
                </button>
              </div>
            )}
            {currentQuestStatus === 'in_progress' && (
              <div data-testid="current-quest-status" className='quest-start'>
                Ce questionnaire a été commencé.
              </div>
            )}
            {currentQuestStatus === 'completed' && (
              <div data-testid="current-quest-status" className='quest-start'>
                Ce questionnaire est fini.
              </div>
            )}
            {currentQuestStatus === 'not_started' && (
              <div className='quest-terminate'>
                <button className='orange-button' data-testid="form-access-btn" onClick={() => window.location.href = '/questionnaires'}>
                  Terminer le questionnaire
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestSpace;
