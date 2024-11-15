import '../../css/pages/homePage.scss'
import HeaderComp from '../../Components/Header/headerComp'
import { QuestSpace } from '../../Components/Questionnaire/questSpace'
import { GraphSpace } from '../../Components/Graph/graphSpace'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import cross from '../../assets/Cross.png'
import '../../css/Components/Feelings/feelings.scss'
import '../../css/Components/Popup/popup.scss'
import MoodFormCreationPopupContent from '../../Components/Popup/moodFormCreation'
import ReportCreationPopupContent from '../../Components/Popup/reportCreation'

const StudentHomePage = () => {
  const [profile, setProfile] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setProfile(JSON.parse(sessionStorage.getItem('profile')))
  }, [])

  const handleFeelingsCreation = () => {
    setIsCreateOpen(!isCreateOpen)
  }

  const handleReportPopup = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='dashboard'>
      <HeaderComp
        title={`Bonjour ${profile?.firstname}, comment te sens-tu aujourd'hui ?`}
        withLogo
      />
      <div className='page-content'>
        <Popup open={isCreateOpen} onClose={handleFeelingsCreation} modal contentStyle={{width: '400px'}}>
          {(close) => (
            <div className='popup-modal-container' style={{gap: '5px'}}>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <MoodFormCreationPopupContent/>
            </div>
          )}
        </Popup>
        <Popup open={isOpen} onClose={handleReportPopup} modal contentStyle={{width: '400px'}}>
          {(close) => (
            <div className='popup-modal-container'>
              <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
              <ReportCreationPopupContent />
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
            <button onClick={handleFeelingsCreation} className='popup-call-btn'>Créer un ressenti</button>
            <button className='popup-call-btn' onClick={handleReportPopup}>Créer un signalement</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentHomePage
