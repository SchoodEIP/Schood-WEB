import React from 'react'
import { LastAlerts } from '../../Components/Alerts/LastAlerts'
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/Sidebar/Sidebar'
import '../../css/pages/homePage.css'

export default function AdmHomePage () {
  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='page-content'>
        <div>
          <Sidebar />
        </div>
        <div>
          <LastAlerts />
        </div>
      </div>
    </div>
  )
}
