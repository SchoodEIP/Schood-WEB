import React, { useEffect, useState } from 'react'
import '../../css/Components/Questionnaire/questSpace.scss'
import { Link, useNavigate } from 'react-router-dom'
import rightArrow from '../../assets/right-arrow.png'
import { disconnect } from '../../functions/disconnect'

export function QuestSpace () {
  const [previousQuestStatus, setPreviousQuestStatus] = useState(null) // Statut du questionnaire précédent
  const [currentQuestStatus, setCurrentQuestStatus] = useState(null) // Statut du questionnaire hebdomadaire

  const navigate = useNavigate()

  const getStatusLastTwo = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/statusLastTwo/`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => {
        if (response.status === 401) {
          disconnect();
        }
        return response.json()
      })
      .then((data) => {
        setCurrentQuestStatus(data.q1)
        setPreviousQuestStatus(data.q2)
      })
      .catch((error) => /* istanbul ignore next */ {
        console.error('Erreur lors de la récupération du statut du questionnaire précédent :', error)
      })
  }

  useEffect(() => {
    getStatusLastTwo()
  }, [])

  const redirect = (id) => {
    navigate(`/questionnaire/${id}`)
  }

  return (
    <div data-testid='quest-space' className='quest-box'>
      <div className='quest-header'>
        <span className='title'>Mes Questionnaires</span>
        <Link to='/questionnaires' className='see-more'>
          Voir plus
          <img className='img' src={rightArrow} alt='Right arrow' />
        </Link>
      </div>
      <div className='quest-body'>
        {((!previousQuestStatus && !currentQuestStatus)) && (
          <div className='no-quest'><p>Aucun questionnaire n'est disponible</p></div>
        )}
        {(previousQuestStatus?.id && previousQuestStatus?.id.length > 0) && (!currentQuestStatus?.id || currentQuestStatus?.id.length === 0) && (
          <div className='questionnaires'>
            <div className='questionnaire' onClick={() => redirect(previousQuestStatus.id)}>
              <div className='header'>
                <div>{previousQuestStatus.title} - {previousQuestStatus.completion}%</div>
              </div>
              <div className='body'>
                <progress value={previousQuestStatus.completion} max={100} />
              </div>
            </div>
          </div>
        )}
        {(previousQuestStatus?.id && previousQuestStatus?.id.length > 0) && (currentQuestStatus?.id && currentQuestStatus?.id.length > 0) && (
          <div className='questionnaires'>
            <div className='questionnaire' onClick={() => redirect(previousQuestStatus.id)}>
              <div className='header'>
                <div>{previousQuestStatus.title} - {previousQuestStatus.completion}%</div>
              </div>
              <div className='body'>
                <progress value={previousQuestStatus.completion} max={100} />
              </div>
            </div>

            <div className='questionnaire' onClick={() => redirect(currentQuestStatus.id)}>
              <div className='header'>
                <div>{currentQuestStatus.title} - {currentQuestStatus.completion}%</div>
              </div>
              <div className='body'>
                <progress value={currentQuestStatus.completion} max={100} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestSpace
