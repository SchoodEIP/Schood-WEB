import React from 'react'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar.jsx'
import '../../css/pages/homePage.css'

export default function AdmHomePage () {
  return (
    <div>
      <div className='page-content'>
        <div>
          <Sidebar />
        </div>
        <div>
          <LastAlerts />
        </div>
        <div>
          <HeaderComp />
        </div>
      </div>
    </div>
  )
}
