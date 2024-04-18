import '../../css/pages/homePage.css'
import HeaderComp from '../../Components/Header/headerComp'
import { QuestSpace } from '../../Components/Questionnaire/questSpace'
import { GraphSpace } from '../../Components/Graph/graphSpace'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import React, { useEffect, useState } from 'react'

const StudentHomePage = () => {
  const [profile, setProfile] = useState(null)
  
  useEffect(() => {
    setProfile(JSON.parse(sessionStorage.getItem('profile')))
  }, [])

  return (
    <div className='dashboard'>
      <HeaderComp 
        title={`Bonjour ${profile?.firstname}, comment te sens-tu aujourd'hui ?`}
        withLogo={true}
      />
      <div className='page-content'>
        <div className='left-half'>
          <GraphSpace />
          <QuestSpace />
        </div>
        <div className='right-half'>
          <LastAlerts />
        </div>
      </div>
    </div>
  )
}

export default StudentHomePage
