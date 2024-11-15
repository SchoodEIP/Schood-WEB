import React, { useState } from 'react'
import '../../css/Components/Popup/popup.scss'
import veryBadMood from '../../assets/newVeryBadMood.png'
import badMood from '../../assets/newBadMood.png'
import averageMood from '../../assets/newAverageMood.png'
import happyMood from '../../assets/newHappyMood.png'
import veryHappyMood from '../../assets/newVeryHappyMood.png'
import '../../css/Components/Feelings/feelings.scss'
import { disconnect } from '../../functions/disconnect'
import emoji1 from '../../assets/emojis/1.png'
import emoji2 from '../../assets/emojis/2.png'
import emoji3 from '../../assets/emojis/3.png'
import emoji4 from '../../assets/emojis/4.png'
import emoji5 from '../../assets/emojis/5.png'

import emoji1Selected from '../../assets/emojis/1s.png'
import emoji2Selected from '../../assets/emojis/2s.png'
import emoji3Selected from '../../assets/emojis/3s.png'
import emoji4Selected from '../../assets/emojis/4s.png'
import emoji5Selected from '../../assets/emojis/5s.png'

const MoodFormCreationPopupContent = () => {
  const [errMessage, setErrMessage] = useState('')
  const [newMood, setNewMood] = useState('')
  const [newAnonymous, setNewAnonymous] = useState(true)
  const [newMessage, setNewMessage] = useState('')

  const handleMood = (moodNumber) => {
    setNewMood(moodNumber)
  }

  const handleAnonymous = () => {
    setNewAnonymous(!newAnonymous)
  }

  const handleMessage = (event) => {
    setNewMessage(event.target.value)
  }

  const handleUpdateFeelings = () => {
    const dataPayload = {
      comment: newMessage,
      mood: newMood,
      annonymous: newAnonymous
    }

    if (newMood !== '') {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/student/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(dataPayload)
      })
        .then(response => {
          if (response.status === 401) {
            disconnect()
          }
          if (response.status === 200) {
            window.location.reload()
          }
        })
        .catch(error => /* istanbul ignore next */ {
          setErrMessage('Erreur lors de la récupération des ressentis', error)
        })
    } else {
      setErrMessage("L'humeur est manquante.")
    }
  }

  return (
    <>
        <span className='popup-title'>Créer un ressenti</span>
        <label id='mood-label' htmlFor='mood-container' className='input-label'>
          <span style={{fontWeight: '600', marginBottom: '5px', marginTop: '15px'}} className='label-content'>Mon humeur <span style={{ color: 'red' }}>*</span></span>
          <div id='mood-container' className='horizontal-container' style={{gap: '10px'}}>
            <img data-testid='mood-0' alt='Très mauvaise humeur' className='emoticone-container' src={newMood === 0 ? emoji1Selected : emoji1} onClick={() => handleMood(0)} />
            <img data-testid='mood-1' alt='Mauvaise humeur' className='emoticone-container' src={newMood === 1 ? emoji2Selected : emoji2} onClick={() => handleMood(1)} />
            <img data-testid='mood-2' alt='Humeur neutre' className='emoticone-container' src={newMood === 2 ? emoji3Selected : emoji3} onClick={() => handleMood(2)} />
            <img data-testid='mood-3' alt='Bonne humeur' className='emoticone-container' src={newMood === 3 ? emoji4Selected : emoji4} onClick={() => handleMood(3)} />
            <img data-testid='mood-4' alt='Très bonne humeur' className='emoticone-container' src={newMood === 4 ? emoji5Selected : emoji5} onClick={() => handleMood(4)} />
          </div>
        </label>
        <label style={{fontWeight: '600'}} id='message-label' htmlFor='message-input'>Message</label>
        <textarea style={{height: '100px', resize: 'none'}} id='message-input' placeholder='Message...' onChange={handleMessage} defaultValue={''} />
        <div id='remember-me'>
          <input id='remember-me-input' type='checkbox' defaultChecked={true} onClick={handleAnonymous} />
          <label for="remember-me-input">Anonyme</label>
        </div>
        {errMessage ? <span style={{ color: 'red' }}>{errMessage}</span> : ''}
        <button className='popup-btn' onClick={handleUpdateFeelings}>Créer le Ressenti</button>
    </>
  )
}

export default MoodFormCreationPopupContent
