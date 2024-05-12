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
import { disconnect } from '../../functions/sharedFunctions'

const FeelingsStudentPage = () => {
  const [alertResponse, setAlertResponse] = useState('')
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
          disconnect();
        }
        return response.json()
      })
      .then(data => {
        setLastFeeling(data[0])
        if (!isPassed) { fillFeelingsContainer(data) }
      })
      .catch(error => /* istanbul ignore next */ {
        setAlertResponse('Erreur lors de la récupération des ressentis', error)
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
      name: 'Créer un Ressenti',
      function: handleFeelingsCreation
    },
    {
      name: 'Modifier le Dernier Ressenti',
      function: handleFeelingsModification
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
              <textarea id='message-input' placeholder='Message...' onChange={handleMessage} defaultValue={isModified ? lastFeeling.comment : ''} />
              <div className='horizontal-container'>
                <input type='checkbox' id='anonymous-checkbox' defaultChecked={isModified ? lastFeeling.annonymous : true} onClick={handleAnonymous} />
                <label htmlFor='anonymous-checkbox' id='anonymous-label'>Anonyme</label>
              </div>
              {errMessage ? <span style={{ color: 'red' }}>{errMessage}</span> : ''}
              <button className='popup-btn' onClick={handleUpdateFeelings}>Créer le Ressenti</button>
            </div>
          )}
        </Popup>
        <div id='feelings-container'>
          <p style={{ color: 'red', paddingLeft: '10px' }}>{alertResponse}</p>
        </div>
      </div>
    </div>
  )
}

export default FeelingsStudentPage
