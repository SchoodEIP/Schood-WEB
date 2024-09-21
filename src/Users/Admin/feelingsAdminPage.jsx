import React, { useEffect, useState, useMemo } from 'react'
import moment from 'moment'
import Popup from 'reactjs-popup'
import HeaderComp from '../../Components/Header/headerComp'
import '../../css/Components/Feelings/feelings.scss'
import '../../css/Components/Popup/popup.scss'
import cross from '../../assets/Cross.png'
import veryBadMood from '../../assets/newVeryBadMood.png'
import badMood from '../../assets/newBadMood.png'
import averageMood from '../../assets/newAverageMood.png'
import happyMood from '../../assets/newHappyMood.png'
import veryHappyMood from '../../assets/newVeryHappyMood.png'
import { disconnect } from '../../functions/disconnect'

const FeelingsAdminPage = () => {
  const [errMessage, setErrMessage] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isModified, setIsModified] = useState(false)
  // const [selectedFeeling, setSelectedFeeling] = useState(null)
  const [newMood, setNewMood] = useState('')
  const [newAnonymous, setNewAnonymous] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [feelings, setFeelings] = useState([
    {
      _id: 'default',
      date: new Date().toISOString(),
      mood: 0,
      annonymous: true,
      comment: 'Ceci est un commentaire par défaut.'
    }
  ])
  const imagePaths = useMemo(() => {
    return [
      veryBadMood,
      badMood,
      averageMood,
      happyMood,
      veryHappyMood
    ]
  }, [])
  const moods = useMemo(() => {
    return ['veryBadMood', 'badMood', 'averageMood', 'happyMood', 'veryHappyMood']
  }, [])
  const emotions = useMemo(() => {
    return {
      veryBadMood: 'Malheureux',
      badMood: 'Mauvaise humeur',
      averageMood: 'Neutre',
      happyMood: 'Bonne Humeur',
      veryHappyMood: 'Heureux'
    }
  }, [])

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
      fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/mood`, {
        method: isModified ? 'PATCH' : 'POST',
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
          if (response.status === 200) { window.location.reload() }
        })
        .catch(error => /* istanbul ignore next */ {
          setErrMessage('Erreur lors de la récupération des ressentis', error)
        })
    } else {
      setErrMessage('L\'humeur n\'est pas indiquée.')
    }
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/moods/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then(response => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
        if (Array.isArray(data)) {
          setFeelings(prevFeelings => [...prevFeelings, ...data])
        } else {
          setErrMessage('Les données reçues ne sont pas valides.')
        }
      })
      .catch(error => /* istanbul ignore next */ {
        setErrMessage('Erreur lors de la récupération des ressentis', error)
      })
  }, [])

  const handleClosePopup = () => {
    setIsCreateOpen(false)
  }

  const handleFeelingsModification = (feeling) => {
    setIsCreateOpen(true)
    setIsModified(true)
    // setSelectedFeeling(feeling)
    setNewMood(feeling.mood)
    setNewAnonymous(feeling.annonymous)
    setNewMessage(feeling.comment)
  }

  async function getUserName(username) {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/profile/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then(response => {
        if (response.status === 401) {
          disconnect()
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
        return `${data.firstname} ${data.lastname}`
      })
      .catch(error => /* istanbul ignore next */ {
        setErrMessage('Erreur lors de la récupération des ressentis', error)
      })
      return 'Erreur'
  }

  return (
    <div>
      <div id='grey-filter' />
      <div>
        <HeaderComp
          title='Ressentis des Étudiants'
          withLogo
          showButtons={false}
        />
      </div>
      <div className='feelings-page'>
        <Popup open={isCreateOpen} onClose={handleClosePopup} modal>
          {(close) => (
            <div className='popup-modal-container'>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              {{/* here we can start a conv with the person who sent a feeling or indicate that it has been taken into account or ask for the person to identify who they are */}}
              {/* <label id='mood-label' htmlFor='mood-container' className='input-label'><span className='label-content'>Mon humeur <span style={{ color: 'red' }}>*</span></span>
                <div id='mood-container' className='horizontal-container'>
                  <div datid='mood-container-0' className='emoticone-container' style={{ border: newMood === 0 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 0 ? 'rgb(211, 200, 200)' : 'white' }} onClick={() => handleMood(0)} title='Très Mauvaise Humeur'>
                    <img src={veryBadMood} alt='Très Mauvaise Humeur' />
                  </div>
                  <div datid='mood-container-1' className='emoticone-container' style={{ border: newMood === 1 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 1 ? 'rgb(211, 200, 200)' : 'white' }} onClick={() => handleMood(1)} title='Mauvaise Humeur'>
                    <img src={badMood} alt='Mauvaise Humeur' />
                  </div>
                  <div datid='mood-container-2' className='emoticone-container' style={{ border: newMood === 2 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 2 ? 'rgb(211, 200, 200)' : 'white' }} onClick={() => handleMood(2)} title='Humeur Neutre'>
                    <img src={averageMood} alt='Humeur Neutre' />
                  </div>
                  <div datid='mood-container-3' className='emoticone-container' style={{ border: newMood === 3 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 3 ? 'rgb(211, 200, 200)' : 'white' }} onClick={() => handleMood(3)} title='Bonne Humeur'>
                    <img src={happyMood} alt='Bonne Humeur' />
                  </div>
                  <div datid='mood-container-4' className='emoticone-container' style={{ border: newMood === 4 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 4 ? 'rgb(211, 200, 200)' : 'white' }} onClick={() => handleMood(4)} title='Très Bonne Humeur'>
                    <img src={veryHappyMood} alt='Très Bonne Humeur' />
                  </div>
                </div>
              </label>
              <label id='message-label' htmlFor='message-input'>Message</label>
              <textarea id='message-input' placeholder='Message...' onChange={handleMessage} value={newMessage} />
              <div className='horizontal-container'>
                <input type='checkbox' id='anonymous-checkbox' checked={newAnonymous} onClick={handleAnonymous} />
                <label htmlFor='anonymous-checkbox' id='anonymous-label'>Anonyme</label>
              </div> */}
              {errMessage ? <span style={{ color: 'red' }}>{errMessage}</span> : ''}
              <button className='popup-btn' onClick={handleUpdateFeelings}>{!isModified ? 'Créer le Ressenti' : 'Modifier le Ressenti'}</button>
            </div>
          )}
        </Popup>
        <div id='feelings-container'>
          {Array.isArray(feelings) && feelings.map((feeling) => (
            <div key={feeling._id} className='individual-feelings-container' >
              <div className='publication-date'>{moment(feeling.date).format('DD/MM/YYYY')}</div>
              <div className='horizontal-line' />
              <div className='feelings-container-content'>
                <div className='container-sidebar'>
                  <div className='emoticone-container'>
                    <img className='emoticone-image' style={{ height: '50px' }} src={imagePaths[feeling.mood]} alt={moods[feeling.mood]} />
                    <span className='emoticone-feeling'>{emotions[moods[feeling.mood]]}</span>
                  </div>
                  <div className='review-status'>
                    <p style={{ marginBottom: '0' }}>{feeling.date !== '' ? 'Pris en compte le:' : 'En attente de prise en compte'}</p>
                    <p style={{ marginTop: '0' }}>{feeling.date !== '' ? `${moment(feeling.date).format('DD/MM/YYYY')}` : ''}</p>
                  </div>
                  <div className='publication-author'>{feeling.annonymous ? 'Anonyme' : ''}</div>
                </div>
                <div className='feelings-content'>
                  <p className='paragraph-style'>{feeling.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeelingsAdminPage
