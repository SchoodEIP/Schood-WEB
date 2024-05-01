import React, { useEffect, useState }  from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import { GraphSpace } from '../../Components/Graph/graphSpace'
import '../../css/pages/homePage.scss'

export default function SchoolAdmHomePage () {
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
          <div className="graph-space" style={{height: "95%"}}>
            <GraphSpace />
          </div>
        </div>
        <div className='right-half'>
          <div className="last-alerts">
            <LastAlerts />
          </div>
        </div>
      </div>
    </div>
  )
}
