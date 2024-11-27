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

const FeelingsStudentPage = () => {
  const [errMessage, setErrMessage] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isPassed, setIsPassed] = useState(false)
  const [isModified, setIsModified] = useState(false)
  const [lastFeeling, setLastFeeling] = useState([])
  const [newMood, setNewMood] = useState('')
  const [newAnonymous, setNewAnonymous] = useState(true)
  const [newMessage, setNewMessage] = useState('')
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
    return [
      { veryBadMood: 'Malheureux' },
      { badMood: 'Mauvaise humeur' },
      { averageMood: 'Neutre' },
      { happyMood: 'Bonne Humeur' },
      { veryHappyMood: 'Heureux' }
    ]
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
    const fillFeelingsContainer = (data) => {
      setIsPassed(true)
      data.map((feeling, index) => {
        const feelingsContainer = document.getElementById('feelings-container')

        const individualFeelingsContainer = document.createElement('div')
        individualFeelingsContainer.className = 'individual-feelings-container'
        individualFeelingsContainer.id = feeling._id

        const publicationDate = document.createElement('div')
        publicationDate.className = 'publication-date'
        publicationDate.textContent = moment(feeling.date).format('DD/MM/YYYY')
        publicationDate.id = 'pub-date-' + feeling._id

        const horizontalLine = document.createElement('div')
        horizontalLine.className = 'horizontal-line'

        const feelingsContainerContent = document.createElement('div')
        feelingsContainerContent.className = 'feelings-container-content'

        const containerSidebar = document.createElement('div')
        containerSidebar.className = 'container-sidebar'

        const emoticoneImage = document.createElement('img')
        emoticoneImage.className = 'emoticone-image'
        emoticoneImage.style.height = '50px'
        emoticoneImage.src = imagePaths[feeling.mood]
        emoticoneImage.alt = moods[feeling.mood]
        emoticoneImage.id = 'emoticone-image-' + feeling._id

        const emoticoneFeeling = document.createElement('span')
        emoticoneFeeling.className = 'emoticone-feeling'
        emoticoneFeeling.textContent = emotions[moods[feeling.mood]]
        emoticoneFeeling.id = 'feeling-' + feeling._id

        const emoticoneContainer = document.createElement('div')

        const reviewStatus = document.createElement('div')
        reviewStatus.className = 'review-status'

        const reviewStatusText = document.createElement('p')
        reviewStatusText.style.marginBottom = '0'
        reviewStatusText.textContent = feeling.date !== '' ? 'Pris en compte le:' : 'En attente de prise en compte'
        reviewStatusText.id = 'review-status-text-' + feeling._id

        const reviewStatusDate = document.createElement('p')
        reviewStatusDate.style.marginTop = '0'
        reviewStatusDate.textContent = feeling.date !== '' ? `${moment(feeling.date).format('DD/MM/YYYY')}` : ''
        reviewStatusDate.id = 'review-status-date-' + feeling._id

        const publicationAuthor = document.createElement('div')
        publicationAuthor.className = 'publication-author'
        publicationAuthor.textContent = feeling.annonymous ? 'Anonyme' : ''
        publicationAuthor.id = 'anonymous-' + feeling._id

        const feelingsContent = document.createElement('div')
        feelingsContent.className = 'feelings-content'

        const paragraph = document.createElement('p')
        paragraph.className = 'paragraph-style'
        paragraph.textContent = feeling.comment
        paragraph.id = 'message-' + feeling._id

        feelingsContainer.appendChild(individualFeelingsContainer)
        individualFeelingsContainer.appendChild(publicationDate)
        individualFeelingsContainer.appendChild(horizontalLine)
        individualFeelingsContainer.appendChild(feelingsContainerContent)
        feelingsContainerContent.appendChild(containerSidebar)
        emoticoneContainer.appendChild(emoticoneImage)
        emoticoneContainer.appendChild(emoticoneFeeling)
        containerSidebar.appendChild(emoticoneContainer)
        reviewStatus.appendChild(reviewStatusText)
        reviewStatus.appendChild(reviewStatusDate)
        containerSidebar.appendChild(reviewStatus)
        containerSidebar.appendChild(publicationAuthor)
        feelingsContainerContent.appendChild(feelingsContent)
        feelingsContent.appendChild(paragraph)

        return feeling
      })
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/student/mood`, {
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
        setLastFeeling(data[0])
        if (!isPassed) { fillFeelingsContainer(data) }
      })
      .catch(error => /* istanbul ignore next */ {
        setErrMessage('Erreur lors de la récupération des ressentis', error)
      })
  }, [setLastFeeling, emotions, moods, imagePaths, lastFeeling.length])

  const handleClosePopup = () => {
    // document.getElementById('grey-filter').style.display = 'none'
    setIsCreateOpen(false)
  }

  const handleFeelingsModification = () => {
    // document.getElementById('grey-filter').style.display = 'flex'
    setIsCreateOpen(!isCreateOpen)
    setIsModified(true)
    setNewMood(lastFeeling.mood)
    setNewAnonymous(lastFeeling.annonymous)
    setNewMessage(lastFeeling.comment)
  }

  const handleFeelingsCreation = () => {
    // document.getElementById('grey-filter').style.display = 'flex'
    setIsCreateOpen(!isCreateOpen)
    setIsModified(false)
    setNewMood('')
    setNewAnonymous(true)
    setNewMessage('')
  }

  const buttonComponent = [
    {
      name: 'Créer un ressenti',
      handleFunction: handleFeelingsCreation
    },
    {
      name: 'Modifier le dernier ressenti',
      handleFunction: handleFeelingsModification
    }
  ]

  return (
    <div>
      <div id='grey-filter' />
      <div>
        <HeaderComp
          title='Mes Ressentis'
          withLogo
          showButtons
          buttonComponent={buttonComponent}
        />
      </div>
      <div className='feelings-page'>
        <Popup open={isCreateOpen} onClose={handleClosePopup} modal contentStyle={{ width: '400px' }}>
          {(close) => (
            <div className='popup-modal-container' style={{ gap: '5px' }}>
              <span className='popup-title'>{!isModified ? 'Créer un ressenti' : 'Modifier le dernier ressenti'}</span>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <label id='mood-label' htmlFor='mood-container' className='input-label'>
                <span style={{ fontWeight: '600', marginBottom: '5px', marginTop: '15px' }} className='label-content'>Mon humeur <span style={{ color: 'red' }}>*</span></span>
                <div id='mood-container' className='horizontal-container' style={{ gap: '10px' }}>
                  <img data-testid='mood-0' alt='Très mauvaise humeur' className='emoticone-container' src={newMood === 0 ? emoji1Selected : emoji1} onClick={() => handleMood(0)} />
                  <img data-testid='mood-1' alt='Mauvaise humeur' className='emoticone-container' src={newMood === 1 ? emoji2Selected : emoji2} onClick={() => handleMood(1)} />
                  <img data-testid='mood-2' alt='Humeur neutre' className='emoticone-container' src={newMood === 2 ? emoji3Selected : emoji3} onClick={() => handleMood(2)} />
                  <img data-testid='mood-3' alt='Bonne humeur' className='emoticone-container' src={newMood === 3 ? emoji4Selected : emoji4} onClick={() => handleMood(3)} />
                  <img data-testid='mood-4' alt='Très bonne humeur' className='emoticone-container' src={newMood === 4 ? emoji5Selected : emoji5} onClick={() => handleMood(4)} />
                </div>
              </label>
              <label style={{ fontWeight: '600' }} id='message-label' htmlFor='message-input'>Message</label>
              <textarea style={{ height: '100px', resize: 'none' }} id='message-input' placeholder='Message...' onChange={handleMessage} defaultValue={isModified ? lastFeeling.comment : ''} />
              <div id='remember-me'>
                <input id='remember-me-input' type='checkbox' defaultChecked={isModified ? lastFeeling.annonymous : true} onClick={handleAnonymous} />
                <label for='remember-me-input'>Anonyme</label>
              </div>
              {errMessage ? <span style={{ color: 'red' }}>{errMessage}</span> : ''}
              <button disabled={newMood === ''} className='popup-btn' onClick={handleUpdateFeelings}>{!isModified ? 'Créer le Ressenti' : 'Modifier le Ressenti'}</button>
            </div>
          )}
        </Popup>
        <div id='feelings-container' />
      </div>
    </div>
  )
}

export default FeelingsStudentPage
