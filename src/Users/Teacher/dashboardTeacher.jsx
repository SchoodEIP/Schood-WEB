import '../../css/pages/homePage.scss'
import HeaderComp from '../../Components/Header/headerComp'
import { QuestSpace } from '../../Components/Questionnaire/questSpace'
import { GraphSpace } from '../../Components/Graph/graphSpace'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import React, { useEffect, useState } from 'react'

const TeacherHomePage = () => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    setProfile(JSON.parse(sessionStorage.getItem('profile')))
  }, [])

  return (
    <div className='dashboard'>
      <HeaderComp
        title={`Bonjour ${profile?.firstname}`}
        withLogo={true}
      />
      <div className='page-content'>
        <div className='left-half'>
          <div className="graph-space" style={{height: "70%"}}>
            <GraphSpace />
          </div>
          <div className="quest-space" style={{height: "35%"}}>
            <QuestSpace />
          </div>
        </div>
        <div className='right-half'>
          <div className="last-alerts">
            <LastAlerts />
          </div>
          <div className="buttons">
            <button className='popup-call-btn'>Créer un Questionnaire</button>
            <button className='popup-call-btn'>Créer un Signalement</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherHomePage
