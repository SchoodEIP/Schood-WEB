import React, { useEffect, useState } from 'react'

export function MoodForm () {
  const [isAnswered, setIsAnswered] = useState(false)
  const [dailyMood, setDailyMood] = useState('')

  useEffect(() => {
    // pour mon questionnaire pour l'humeur, j'ai besoin de :
    // GET le status du questionnaire pour cet utilisateur
    // // si déjà rempli aujourd'hui alors message reçu est l'humeur donnée
    // // si non alors donner à utilisateur option de le remplir
    // POST envoyer comment on se sent aujourd'hui
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/dailyMood`, {
      method: 'GET',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.humorStatus === true) {
          setIsAnswered(true)
          setDailyMood(data.humor)
        }
      })
      .catch((error) => {
        console.error('Erreur :', error)
      })
  }, [])

  const handleMood = (mood) => {
    setIsAnswered(true)
    setDailyMood(mood)

    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/dailyMood`, {
      method: 'POST',
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAnswered(true)
        setDailyMood(mood)
      })
      .catch((error) => {
        console.error('Erreur :', error)
      })
  }

  return (
    <div className='graph-box'>
      <div className='graph-header'>
        <p className='title'>Quelle est votre humeur du jour ?</p>
      </div>
      <div className='graph-body'>
        <div className='graph-content'>
          { isAnswered ?
            <p>Votre humeur du jour : {dailyMood}</p> :
            <div>
              <button className="moodBtn" onClick={() => handleMood('En colère')}>En colère</button>
              <button className="moodBtn" onClick={() => handleMood('Déprimé')}>Déprimé</button>
              <button className="moodBtn" onClick={() => handleMood('Triste')}>Triste</button>
              <button className="moodBtn" onClick={() => handleMood('Content')}>Content</button>
              <button className="moodBtn" onClick={() => handleMood('Heureux')}>Heureux</button>
              <button className="moodBtn" onClick={() => handleMood('Épanoui')}>Épanoui</button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default MoodForm
