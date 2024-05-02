import React, { useEffect, useState }  from 'react'
import HeaderComp from '../../Components/Header/headerComp'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import '../../css/pages/homePage.scss'

export default function AdmHomePage () {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    setProfile(JSON.parse(sessionStorage.getItem('profile')))
  }, [])

  return (
    <div className='dashboard'>
      <div>
        <HeaderComp
          title={`Bonjour ${profile?.firstname}`}
          withLogo={true}
        />
      </div>
      <div className='page-content'>
        <div className='right-half'>
          <div className="last-alerts">
            <LastAlerts />
          </div>
        </div>
      </div>
    </div>
  )
}
