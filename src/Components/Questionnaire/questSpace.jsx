import React, { useEffect, useState } from 'react'
import '../../css/Components/Questionnaire/questSpace.css'
import { useNavigate } from 'react-router-dom'

export function QuestSpace () {
  const [previousQuestStatus, setPreviousQuestStatus] = useState(0) // Statut du questionnaire précédent
  const [currentQuestStatus, setCurrentQuestStatus] = useState(0) // Statut du questionnaire hebdomadaire
  const [previousQuestUrl, setPreviousQuestUrl] = useState('') // Statut du questionnaire précédent
  const [currentQuestUrl, setCurrentQuestUrl] = useState('') // Statut du questionnaire hebdomadaire

  const navigate = useNavigate()

  useEffect(() => {
    function isDateInCurrentWeek (date) {
      const checkDate = new Date(date)

      const currentDate = new Date()

      const currentDayOfWeek = currentDate.getDay()

      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1))
      startOfWeek.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return checkDate >= startOfWeek && checkDate <= endOfWeek
    }

    function isDateInPreviousWeek (date) {
      const checkDate = new Date(date)

      const currentDate = new Date()

      const startOfPreviousWeek = new Date(currentDate)

      startOfPreviousWeek.setDate(currentDate.getDate() - currentDate.getDay() - 6)
      startOfPreviousWeek.setHours(0, 0, 0, 0)

      const endOfPreviousWeek = new Date(startOfPreviousWeek)
      endOfPreviousWeek.setDate(startOfPreviousWeek.getDate() + 6)

      return checkDate >= startOfPreviousWeek && checkDate <= endOfPreviousWeek
    }

    // Effectuer une requête GET pour récupérer le statut des deux derniers questionnaires
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/statusLastTwo/`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentQuestStatus(data.q1)
        setPreviousQuestStatus(data.q2)
      })
      .catch((error) => /* istanbul ignore next */ {
        console.error('Erreur lors de la récupération du statut du questionnaire précédent :', error)
      })

    // Effectuer une requête GET pour récupérer les questionnaires
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          if (isDateInCurrentWeek(data[0].fromDate)) {
            setCurrentQuestUrl(`/questionnaire/${data[0]._id}`)
          } else if (isDateInPreviousWeek(data[0].fromDate)) {
            setPreviousQuestUrl(`/questionnaire/${data[0]._id}`)
          }
          if (data.length > 1) {
            if (isDateInCurrentWeek(data[1].fromDate)) {
              setCurrentQuestUrl(`/questionnaire/${data[1]._id}`)
            } else if (isDateInPreviousWeek(data[1].fromDate)) {
              setPreviousQuestUrl(`/questionnaire/${data[1]._id}`)
            }
          }
        }
      })
      .catch((error) => /* istanbul ignore next */ {
        console.error('Erreur lors de la récupération du statut du questionnaire précédent :', error)
      })
  }, [])

  const handlePreviousClick = () => {
    navigate(previousQuestUrl)
  }

  const handleCurrentClick = () => {
    navigate(currentQuestUrl)
  }

  return (
    <div data-testid='quest-space' className='quest-box'>
      <div className='quest-header'>
        <p className='title'>Mes Questionnaires</p>
      </div>
      <div className='quest-body'>
        <div className='quest-content'>
          <div className='quest-previous'>
            <p>Questionnaire précédent</p>
            {previousQuestUrl === '' && (
              <div>
                <p>Il n'y a pas de questionnaire précédent pour le moment.</p>
              </div>
            )}
            {(previousQuestStatus > 0 && previousQuestStatus < 100 && previousQuestUrl !== '') && (
              <div className='quest-start'>
                Ce questionnaire n'a pas été terminé à temps.
              </div>
            )}
            {(previousQuestStatus === 100 && previousQuestUrl !== '') && (
              <div data-testid='previous-quest-status' className='quest-start'>
                Ce questionnaire a été complété.
              </div>
            )}
            {(previousQuestUrl !== '') && (
              <div className='quest-terminate'>
                <button className='green-button' onClick={handlePreviousClick}>
                  Aller au Questionnaire
                </button>
              </div>
            )}
          </div>
          <div className='quest-current'>
            <p>Questionnaire hebdomadaire</p>
            {currentQuestUrl === '' && (
              <div>
                <p>Il n'y a pas de questionnaire actuel pour le moment.</p>
              </div>
            )}
            {(currentQuestStatus > 0 && currentQuestStatus < 100 && currentQuestUrl !== '') && (
              <div data-testid='current-quest-status' className='quest-start'>
                Ce questionnaire a été commencé.
              </div>
            )}
            {(currentQuestStatus === 100 && currentQuestUrl !== '') && (
              <div data-testid='current-quest-status' className='quest-start'>
                Ce questionnaire a été complété.
              </div>
            )}
            {(currentQuestStatus === 0 && currentQuestUrl !== '') && (
              <div className='quest-start'>
                <button className='green-button' onClick={handleCurrentClick}>
                  Lancer le questionnaire
                </button>
              </div>
            )}
            {(currentQuestStatus > 0 && currentQuestStatus < 100) && (
              <div className='quest-terminate'>
                <button className='orange-button' data-testid='form-access-btn' onClick={handleCurrentClick}>
                  Terminer le questionnaire
                </button>
              </div>
            )}
            {(currentQuestStatus === 100 && previousQuestUrl !== '') && (
              <div className='quest-terminate'>
                <button className='green-button' onClick={handleCurrentClick}>
                  Aller au Questionnaire
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestSpace
