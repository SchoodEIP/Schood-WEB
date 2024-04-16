import React from 'react'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import '../../css/pages/homePage.css'
import { QuestSpace } from '../../Components/Questionnaire/questSpace'
import { GraphSpace } from '../../Components/Graph/graphSpace'

export default function SchoolAdmHomePage () {
  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='page-content'>
        <div className='left-half'>
          <div>
            <GraphSpace />
          </div>
          <div>
            <QuestSpace />
          </div>
        </div>
        <div className='right-half'>
          <LastAlerts />
        </div>
      </div>
    </div>
  )
}
