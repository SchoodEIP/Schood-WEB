import '../../css/pages/homePage.css'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import { QuestSpace } from '../../Components/Questionnaire/questSpace'
import { GraphSpace } from '../../Components/Graph/graphSpace'
import { LastAlerts } from '../../Components/Alerts/lastAlerts'
import React from 'react'

const TeacherHomePage = () => {
  return (
    <div className='dashboard'>
      <div>
        <HeaderComp />
      </div>
      <div className='page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='left-half'>
          <div>
            <GraphSpace />
          </div>
          <div>
            <QuestSpace />
          </div>
        </div>
        <div className="right-half">
            <LastAlerts />
          </div>
      </div>
    </div>
  )
}

export default TeacherHomePage
