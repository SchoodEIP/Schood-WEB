import React, { useState, useEffect } from 'react'
import '../../css/Components/Feelings/feelings.scss'

const Feelings = (props) => {
  const [selectedEmotion, setSelectedEmotion] = useState('') // Émotion sélectionnée
  const [writtenFeeling, setWrittenFeeling] = useState('') // Ressenti écrit
  const [isAnonymous, setIsAnonymous] = useState(true) // Anonyme par défaut
  const [alertResponse, setAlertResponse] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const handleEmotionClick = (emotion) => {
    setSelectedEmotion(emotion)
  }
  // Fonction pour gérer l'envoi du ressenti
  const sendFeelings = () => {
    // Construire l'objet de données à envoyer
    const feelingsData = {
      emotion: selectedEmotion,
      writtenFeeling,
      isAnonymous
    }

    // Effectuer la requête POST
    fetch(`${process.env.REACT_APP_BACKEND_URL}/student/feelings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify(feelingsData)
    })
      .then(response => response.json())
      .then(data => {
        resetForm()
        setAlertResponse('Ressenti envoyé avec succès')
        setShowPopup(true)
      })
      .catch(error => {
        setAlertResponse('Erreur lors de l\'envoi du ressenti', error)
        setShowPopup(true)
      })
  }

  useEffect(() => {
    if (showPopup) {
      resetForm()
    }
  }, [showPopup])

  const resetForm = () => {
    setWrittenFeeling('')
    setSelectedEmotion('')
    setIsAnonymous(true)

    setTimeout(() => {
      setAlertResponse('')
      setShowPopup(false)
    }, 3000)
  }

  return (
    <div className='feelings-page'>
      <div>
        <label>Sélectionnez votre émotion:</label>
        <div className='emotion-grid'>
          {props.moods.map((mood, index) => (
            <div
              key={index} onClick={() => handleEmotionClick(mood)}
              className={selectedEmotion === mood ? 'emoji-mood selected-emotion' : 'emoji-mood'}
            >
              <img src={props.moodPaths[mood]} alt={props.emotions[mood]} style={{ height: '42px' }} />
              <div className='emotion-name'>{props.emotions[mood]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Champ pour indiquer le ressenti par écrit */}
      <div>
        <label htmlFor='feelingText'>Indiquez votre ressenti par écrit:</label>
        <textarea id='feelingText' data-testid='feelingText' value={writtenFeeling} onChange={(e) => setWrittenFeeling(e.target.value)} />
      </div>

      {/* Option pour répondre anonymement */}
      <div>
        <label htmlFor='anonymousCheckbox' data-testid='anonymousCheckbox'>Je souhaite rester anonyme:</label>
        <input
          id='anonymousCheckbox'
          type='checkbox'
          checked={isAnonymous}
          onChange={() => setIsAnonymous(!isAnonymous)}
        />
      </div>

      {showPopup && <div data-testid='popupTest' className='popup' onClick={() => setShowPopup(false)}>{alertResponse}</div>}
      <button data-testid='buttonSend' className='button-css' onClick={sendFeelings}>Envoyer le ressenti</button>

    </div>
  )
}

export default Feelings
