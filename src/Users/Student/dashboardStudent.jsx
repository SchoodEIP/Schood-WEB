import '../../css/pages/homePage.scss'
import HeaderComp from '../../Components/Header/headerComp'
import { QuestSpace } from '../../Components/Questionnaire/questSpace'
import { GraphSpace } from '../../Components/Graph/graphSpace'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import cross from '../../assets/Cross.png'
import veryBadMood from '../../assets/newVeryBadMood.png'
import badMood from '../../assets/newBadMood.png'
import averageMood from '../../assets/newAverageMood.png'
import happyMood from '../../assets/newHappyMood.png'
import veryHappyMood from '../../assets/newVeryHappyMood.png'
import '../../css/Components/Feelings/feelings.scss'
import '../../css/Components/Popup/popup.scss'
import { disconnect } from '../../functions/sharedFunctions'

const StudentHomePage = () => {
  const [profile, setProfile] = useState(null)
  const [errMessage, setErrMessage] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isModified, setIsModified] = useState(false)
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
        method: isModified ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(dataPayload)
      })
        .then(response => {
          if (response.status === 401) {
            disconnect();
          }
          if (response.status === 200) { window.location.reload() }
        })
        .catch(error => /* istanbul ignore next */ {
          setErrMessage('Erreur lors de la récupération des ressentis', error)
        })
    }
  }

  useEffect(() => {
    setProfile(JSON.parse(sessionStorage.getItem('profile')))
  }, [])

  const handleClosePopup = () => {
    setIsCreateOpen(false)
  }

  const handleFeelingsCreation = () => {
    setIsCreateOpen(!isCreateOpen)
    setIsModified(false)
    setNewMood('')
    setNewAnonymous(true)
    setNewMessage('')
  }

  return (
    <div className='dashboard'>
      <HeaderComp
        title={`Bonjour ${profile?.firstname}, comment te sens-tu aujourd'hui ?`}
        withLogo
      />
      <div className='page-content'>
        <Popup open={isCreateOpen} onClose={handleClosePopup} modal>
          {(close) => (
            <div className='popup-modal-container'>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <label id='mood-label' htmlFor='mood-container' className='input-label'><span className='label-content'>Mon humeur <span style={{ color: 'red' }}>*</span></span>
                <div id='mood-container' className='horizontal-container'>
                  <div id='mood-container-0' className='emoticone-container' style={{ border: newMood === 0 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 0 ? 'rgb(211, 200, 200)' : 'white' }} onClick={() => handleMood(0)} title='Très Mauvaise Humeur'>
                    <img src={veryBadMood} alt='Très Mauvaise Humeur' />
                  </div>
                  <div id='mood-container-1' className='emoticone-container' style={{ border: newMood === 1 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 1 ? 'rgb(211, 200, 200)' : 'white' }} onClick={() => handleMood(1)} title='Mauvaise Humeur'>
                    <img src={badMood} alt='Mauvaise Humeur' />
                  </div>
                  <div id='mood-container-2' className='emoticone-container' style={{ border: newMood === 2 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 2 ? 'rgb(211, 200, 200)' : 'white' }} onClick={() => handleMood(2)} title='Neutre'>
                    <img src={averageMood} alt='Humeur Neutre' />
                  </div>
                  <div id='mood-container-3' className='emoticone-container' style={{ border: newMood === 3 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 3 ? 'rgb(211, 200, 200)' : 'white' }} onClick={() => handleMood(3)} title='Bonne Humeur'>
                    <img src={happyMood} alt='Bonne Humeur' />
                  </div>
                  <div id='mood-container-4' className='emoticone-container' style={{ border: newMood === 4 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 4 ? 'rgb(211, 200, 200)' : 'white' }} onClick={() => handleMood(4)} title='Très Bonne Humeur'>
                    <img src={veryHappyMood} alt='Très Bonne Humeur' />
                  </div>
                </div>
              </label>
              <label id='message-label' htmlFor='message-input'>Message</label>
              <textarea id='message-input' placeholder='Message...' onChange={handleMessage} />
              <div className='horizontal-container'>
                <input type='checkbox' id='anonymous-checkbox' defaultChecked onClick={handleAnonymous} />
                <label htmlFor='anonymous-checkbox' id='anonymous-label'>Anonyme</label>
              </div>
              {errMessage ? <span style={{ color: 'red' }}>{errMessage}</span> : ''}
              <button className='popup-btn' onClick={handleUpdateFeelings}>Créer le Ressenti</button>
            </div>
          )}
        </Popup>
        <div className='left-half'>
          <div className='graph-space' style={{ height: '70%' }}>
            <GraphSpace />
          </div>
          <div className='quest-space' style={{ height: '35%' }}>
            <QuestSpace />
          </div>
        </div>
        <div className='right-half'>
          <div className='last-alerts'>
            <LastAlerts />
          </div>
          <div className='buttons'>
            <button onClick={handleFeelingsCreation} className='popup-call-btn'>Créer un Ressenti</button>
            <button className='popup-call-btn'>Créer un Signalement</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentHomePage
