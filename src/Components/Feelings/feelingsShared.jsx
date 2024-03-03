import React, { useState, useEffect } from 'react'
import '../../css/Components/Feelings/feelings.scss'

const emotionsData = [
  { emotion: 'Joyeux', description: 'Heureux et enthousiaste', emoji: '😄' },
  { emotion: 'Joie modérée', description: 'Content et satisfait', emoji: '😊' },
  { emotion: 'Plein d\'énergie', description: 'Énergique et dynamique', emoji: '💪' },
  { emotion: 'Calme', description: 'Tranquille et serein', emoji: '😌' },
  { emotion: 'Neutre', description: 'Ni joyeux ni triste', emoji: '😐' },
  { emotion: 'Ennuyé', description: 'Peu intéressé et ennuyé', emoji: '😑' },
  { emotion: 'Triste', description: 'Attristé et déprimé', emoji: '😢' },
  { emotion: 'En colère', description: 'Irrité et furieux', emoji: '😡' },
  { emotion: 'Fatigué', description: 'Fatigué mais pas épuisé', emoji: '😓' },
  { emotion: 'Exténué', description: 'Épuisé et vidé', emoji: '😩' },
  { emotion: 'Anxieux', description: 'Inquiet et nerveux', emoji: '😰' },
  { emotion: 'Sous pression', description: 'Sous stress et pression', emoji: '🤯' },
  { emotion: 'Malade', description: 'Malade et faible', emoji: '🤢' },
  { emotion: 'Perdu', description: 'Confus et désorienté', emoji: '😵' }
]

const Feelings = () => {
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
    fetch(`${process.env.REACT_APP_BACKEND_URL}/path/to/feelings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify(feelingsData)
    })
      .then(response => {
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
    console.log(writtenFeeling)
    setWrittenFeeling('')
    console.log(writtenFeeling)
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
          {emotionsData.map((emotionData, index) => (
            <div
              key={index} onClick={() => handleEmotionClick(emotionData.emotion)}
              className={selectedEmotion === emotionData.emotion ? 'emoji-mood selected-emotion' : 'emoji-mood'}
            >
              <span role='img' aria-label={emotionData.emotion}>{emotionData.emoji}</span>
              <div className='emotion-name'>{emotionData.emotion}</div>
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
