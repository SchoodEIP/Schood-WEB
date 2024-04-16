import React, { useEffect, useState, useMemo } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import moment from 'moment'
import FeelingsPopup from '../../Components/Feelings/feelingsPopup'
import '../../css/Components/Feelings/feelings.scss'
import veryBadMood from '../../assets/newVeryBadMood.png'
import badMood from '../../assets/newBadMood.png'
import averageMood from '../../assets/newAverageMood.png'
import happyMood from '../../assets/newHappyMood.png'
import veryHappyMood from '../../assets/newVeryHappyMood.png'

const FeelingsStudentPage = () => {
  const [alertResponse, setAlertResponse] = useState('')
  const [errMessage, setErrMessage] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isModifyOpen, setIsModifyOpen] = useState(false)
  const [isModified, setIsModified] = useState(false)
  const [lastFeeling, setLastFeeling] = useState([])
  const [payload, setPayload] = useState({})
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

  function insertNewFeeling (dataPayload) {
    const feelingsContainer = document.getElementById('feelings-container')

    const individualFeelingsContainer = document.createElement('div')
    individualFeelingsContainer.className = 'individual-feelings-container'
    individualFeelingsContainer.id = dataPayload.id

    const publicationDate = document.createElement('div')
    publicationDate.className = 'publication-date'
    publicationDate.textContent = moment(dataPayload.date).format('DD/MM/YYYY')
    publicationDate.id = 'pub-date-' + dataPayload.id

    const horizontalLine = document.createElement('div')
    horizontalLine.className = 'horizontal-line'

    const feelingsContainerContent = document.createElement('div')
    feelingsContainerContent.className = 'feelings-container-content'

    const containerSidebar = document.createElement('div')
    containerSidebar.className = 'container-sidebar'

    const emoticoneImage = document.createElement('img')
    emoticoneImage.className = 'emoticone-image'
    emoticoneImage.style.height = '50px'
    emoticoneImage.src = imagePaths[dataPayload.mood]
    emoticoneImage.alt = moods[dataPayload.mood]
    emoticoneImage.id = 'emoticone-image-' + dataPayload.id

    const emoticoneFeeling = document.createElement('span')
    emoticoneFeeling.className = 'emoticone-feeling'
    emoticoneFeeling.textContent = emotions[moods[dataPayload.mood]]
    emoticoneFeeling.id = 'feeling-' + dataPayload.id

    const emoticoneContainer = document.createElement('div')

    const reviewStatus = document.createElement('div')
    reviewStatus.className = 'review-status'

    const reviewStatusText = document.createElement('p')
    reviewStatusText.style.marginBottom = '0'
    reviewStatusText.textContent = 'En attente de prise en compte'
    reviewStatusText.id = 'review-status-text-' + dataPayload.id

    const reviewStatusDate = document.createElement('p')
    reviewStatusDate.style.marginTop = '0'
    reviewStatusDate.textContent = ''
    reviewStatusDate.id = 'review-status-date-' + dataPayload.id

    const publicationAuthor = document.createElement('div')
    publicationAuthor.className = 'publication-author'
    publicationAuthor.textContent = dataPayload.isAnonymous ? 'Anonyme' : ''
    publicationAuthor.id = 'anonymous-' + dataPayload.id

    const feelingsContent = document.createElement('div')
    feelingsContent.className = 'feelings-content'

    const paragraph = document.createElement('p')
    paragraph.className = 'paragraph-style'
    paragraph.textContent = dataPayload.message
    paragraph.id = 'message-' + dataPayload.id

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

    const existingIndividualFeelingsContainers = feelingsContainer.querySelectorAll('.individual-feelings-container')
    if (existingIndividualFeelingsContainers.length >= 1) {
      feelingsContainer.insertBefore(individualFeelingsContainer, existingIndividualFeelingsContainers[0])
    } else {
      feelingsContainer.appendChild(individualFeelingsContainer)
    }
  }

  const handleUpdateFeelings = (dataPayload) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/student/feelings`, {
      method: isModified ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        if (isModified) {
          document.getElementById('review-status-text-' + dataPayload.id).textContent = 'En attente de prise en compte'
          document.getElementById('review-status-date-' + dataPayload.id).textContent = ''
          document.getElementById('anonymous-' + dataPayload.id).textContent = dataPayload.isAnonymous ? 'Anonyme' : ''
          document.getElementById('message-' + dataPayload.id).textContent = dataPayload.message
          document.getElementById('feeling-' + dataPayload.id).textContent = emotions[moods[dataPayload.mood]]
          document.getElementById('emoticone-image-' + dataPayload.id).src = imagePaths[dataPayload.mood]
          document.getElementById('emoticone-image-' + dataPayload.id).alt = emotions[moods[dataPayload.mood]]
        } else {
          insertNewFeeling(dataPayload)
        }
      })
      .catch(error => /* istanbul ignore next */ {
        setErrMessage('Erreur lors de la récupération des ressentis', error)
      })
  }

  useEffect(() => {
    const fillFeelingsContainer = (data) => {
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
        emoticoneImage.src = imagePaths[feeling.feeling]
        emoticoneImage.alt = moods[feeling.feeling]
        emoticoneImage.id = 'emoticone-image-' + feeling._id

        const emoticoneFeeling = document.createElement('span')
        emoticoneFeeling.className = 'emoticone-feeling'
        emoticoneFeeling.textContent = emotions[moods[feeling.feeling]]
        emoticoneFeeling.id = 'feeling-' + feeling._id

        const emoticoneContainer = document.createElement('div')

        const reviewStatus = document.createElement('div')
        reviewStatus.className = 'review-status'

        const reviewStatusText = document.createElement('p')
        reviewStatusText.style.marginBottom = '0'
        reviewStatusText.textContent = feeling.reviewDate !== '' ? 'Pris en compte le:' : 'En attente de prise en compte'
        reviewStatusText.id = 'review-status-text-' + feeling._id

        const reviewStatusDate = document.createElement('p')
        reviewStatusDate.style.marginTop = '0'
        reviewStatusDate.textContent = feeling.reviewDate !== '' ? `${moment(feeling.reviewDate).format('DD/MM/YYYY')}` : ''
        reviewStatusDate.id = 'review-status-date-' + feeling._id

        const publicationAuthor = document.createElement('div')
        publicationAuthor.className = 'publication-author'
        publicationAuthor.textContent = feeling.isAnonymous ? 'Anonyme' : ''
        publicationAuthor.id = 'anonymous-' + feeling._id

        const feelingsContent = document.createElement('div')
        feelingsContent.className = 'feelings-content'

        const paragraph = document.createElement('p')
        paragraph.className = 'paragraph-style'
        paragraph.textContent = feeling.content
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

    fetch(`${process.env.REACT_APP_BACKEND_URL}/student/feelings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then(response => response.json())
      .then(data => {
        setLastFeeling(data[0]._id)
        fillFeelingsContainer(data)
      })
      .catch(error => /* istanbul ignore next */ {
        setAlertResponse('Erreur lors de la récupération des ressentis', error)
      })
  }, [setLastFeeling, emotions, moods, imagePaths, lastFeeling.length])

  const handleClosePopup = () => {
    document.getElementById('grey-filter').style.display = 'none'
    setIsCreateOpen(false)
    setIsModifyOpen(false)
  }

  const handleFeelingsModification = () => {
    document.getElementById('grey-filter').style.display = 'flex'
    setIsCreateOpen(false)
    setIsModifyOpen(true)
    setIsModified(true)
  }

  const handleFeelingsCreation = () => {
    document.getElementById('grey-filter').style.display = 'flex'
    setIsCreateOpen(true)
    setIsModifyOpen(false)
    setIsModified(false)
  }

  const updatePayload = (newPayload) => {
    setPayload(newPayload)
  }

  return (
    <div>
      <div id='grey-filter' />
      <div>
        <HeaderComp />
      </div>
      <div className='different-page-content'>
        <div className='feelings-content'>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '25px' }}>
            <h1 id='feeling-title'>Mes Ressentis</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
              <button onClick={handleFeelingsCreation} className='button-css'>Créer un ressenti</button>
              <button onClick={handleFeelingsModification} className='button-css'>Modifier le dernier ressenti</button>
            </div>
          </div>
          {isCreateOpen
            ? <FeelingsPopup
                moods={moods}
                lastFeeling={lastFeeling}
                modify={false}
                errMessage={errMessage}
                updatePayload={updatePayload}
                handleCreation={handleUpdateFeelings}
                handleClose={handleClosePopup}
              />
            : ''}
          {isModifyOpen
            ? <FeelingsPopup
                moods={moods}
                lastFeeling={lastFeeling}
                modify
                errMessage={errMessage}
                updatePayload={updatePayload}
                handleCreation={handleUpdateFeelings}
                handleClose={handleClosePopup}
              />
            : ''}
          <div id='feelings-container'>
            <p style={{ color: 'red', paddingLeft: '10px' }}>{alertResponse}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeelingsStudentPage
