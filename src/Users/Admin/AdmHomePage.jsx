import React from 'react'
import { LastAlerts } from '../../Components/Alerts/LastAlerts'
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/Sidebar/Sidebar'
import './AdmHomePage.css'

export default function AdmHomePage () {
  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='page-body'>
        <div className='left-half'>
          <Sidebar />
        </div>
        <div className='right-half'>
          <LastAlerts />
        </div>
      </div>
    </div>
  )
}
