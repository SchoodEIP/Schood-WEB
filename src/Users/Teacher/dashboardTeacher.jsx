import '../../css/pages/homePage.scss'
import HeaderComp from '../../Components/Header/headerComp'
import { QuestSpace } from '../../Components/Questionnaire/questSpace'
import { GraphSpace } from '../../Components/Graph/graphSpace'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import cross from '../../assets/Cross.png'
import ReportCreationPopupContent from '../../Components/Popup/reportCreation'

const TeacherHomePage = () => {
  const [profile, setProfile] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setProfile(JSON.parse(sessionStorage.getItem('profile')))
  }, [])

  const handleGoToNewForm = () => {
    window.location.href = '/questionnaire'
  }

  const handleReportPopup = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='dashboard'>
      <Popup open={isOpen} onClose={handleReportPopup} modal>
        {(close) => (
          <div className='popup-modal-container'>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <ReportCreationPopupContent onClose={close} />
          </div>
        )}
      </Popup>
      <HeaderComp
        title={`Bonjour ${profile?.firstname}`}
        withLogo
      />
      <div className='page-content'>
        <div className='left-half'>
          <div className='graph-space'>
            <GraphSpace />
          </div>
          <div className='quest-space'>
            <QuestSpace />
          </div>
        </div>
        <div className='right-half'>
          <div className='last-alerts'>
            <LastAlerts />
          </div>
          <div className='buttons'>
            <button className='popup-call-btn' onClick={handleGoToNewForm}>Créer un Questionnaire</button>
            <button className='popup-call-btn' onClick={handleReportPopup}>Créer un Signalement</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherHomePage
