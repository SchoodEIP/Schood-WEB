import React from 'react'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar.jsx'
import '../../css/pages/homePage.scss'

export default function AdmHomePage () {
  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='page-content'>
        <div>
          <LastAlerts />
        </div>
      </div>
    </div>
  )
}
