import React, { useEffect, useState } from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import Feelings from '../../Components/Feelings/feelingsShared'
import moment from 'moment'

const FeelingsStudentPage = () => {
  const [alertResponse, setAlertResponse] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const imagePaths = {
    veryBadMood: require('../../assets/veryBadMood.png'),
    badMood: require('../../assets/badMood.png'),
    averageMood: require('../../assets/averageMood.png'),
    happyMood: require('../../assets/happyMood.png'),
    veryHappyMood: require('../../assets/veryHappyMood.png')
  }
  const moods = ['veryBadMood', 'badMood', 'averageMood', 'happyMood', 'veryHappyMood']
  const emotions = {
    veryBadMood: 'Malheureux',
    badMood: 'Mauvaise humeur',
    averageMood: 'Neutre',
    happyMood: 'Bonne Humeur',
    veryHappyMood: 'Heureux'
  }

  useEffect(() => {
    function fillFeelingsContainer (data) {
      data.map((feeling, index) => {
        const feelingsContainer = document.getElementById('feelings-container')

        const individualFeelingsContainer = document.createElement('div')
        individualFeelingsContainer.className = 'individual-feelings-container'

        const publicationDate = document.createElement('div')
        publicationDate.className = 'publication-date'
        publicationDate.textContent = moment(feeling.date).format('DD/MM/YYYY')

        const horizontalLine = document.createElement('div')
        horizontalLine.className = 'horizontal-line'

        const feelingsContainerContent = document.createElement('div')
        feelingsContainerContent.className = 'feelings-container-content'

        const containerSidebar = document.createElement('div')
        containerSidebar.className = 'container-sidebar'

        const emoticoneImage = document.createElement('img')
        emoticoneImage.className = 'emoticone-image'
        emoticoneImage.style.height = '50px'
        emoticoneImage.src = imagePaths[moods[feeling.feeling]]
        emoticoneImage.alt = moods[feeling.feeling]

        const emoticoneFeeling = document.createElement('span')
        emoticoneFeeling.className = 'emoticone-feeling'
        emoticoneFeeling.textContent = emotions[moods[feeling.feeling]]

        const emoticoneContainer = document.createElement('div')
        emoticoneContainer.className = 'emoticone-container'

        const reviewStatus = document.createElement('div')
        reviewStatus.className = 'review-status'

        const reviewStatusText = document.createElement('p')
        reviewStatusText.style.marginBottom = '0'
        reviewStatusText.textContent = feeling.reviewDate !== '' ? 'Pris en compte le:' : 'En attente de prise en compte'

        const reviewStatusDate = document.createElement('p')
        reviewStatusDate.style.marginTop = '0'
        reviewStatusDate.textContent = feeling.reviewDate !== '' ? `${moment(feeling.reviewDate).format('DD/MM/YYYY')}` : ''

        const publicationAuthor = document.createElement('div')
        publicationAuthor.className = 'publication-author'
        publicationAuthor.textContent = feeling.isAnonymous ? 'Anonyme' : ''

        const feelingsContent = document.createElement('div')
        feelingsContent.className = 'feelings-content'

        const paragraph = document.createElement('p')
        paragraph.className = 'paragraph-style'
        paragraph.textContent = feeling.content

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

    const dataResp = [
      {
        date: '2024-03-30',
        content: "Je me sens pas bien aujourd'hui",
        feeling: 0,
        isAnonymous: true,
        reviewDate: ''
      },
      {
        date: '2024-03-20',
        content: "J'ai la forme",
        feeling: 4,
        isAnonymous: false,
        reviewDate: '2024-03-22'
      }
    ]

    fillFeelingsContainer(dataResp)

    fetch(`${process.env.REACT_APP_BACKEND_URL}/student/feelings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then(response => response.json())
      .then(data => {
        fillFeelingsContainer(data)
      })
      .catch(error => /* istanbul ignore next */ {
        setAlertResponse('Erreur lors de la récupération des ressentis', error)
      })
  })

  const handleFeelingsCreation = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='different-page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='feelings-content'>
          <h1 id='feeling-title'>Mes Ressentis</h1>
          <button onClick={handleFeelingsCreation} className='button-css'>Créer un ressenti</button>
          {isOpen ? <Feelings emotions={emotions} moods={moods} moodPaths={imagePaths} /> : ''}
          <div id='feelings-container'>
            <p style={{ color: 'red', paddingLeft: '10px' }}>{alertResponse}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeelingsStudentPage
