import './dashboard_teacher.scss'
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { QuestSpace } from '../../Components/Questionnaire/QuestSpace'
import { GraphSpace } from '../../Components/Graph/GraphSpace'
import { LastAlerts } from '../../Components/Alerts/LastAlerts'
import React, { useEffect, useState } from 'react'

const TeacherHomePage = () => {
  return (
    <div className='dashboard'>
      <div>
        <HeaderComp />
      </div>
      <div className='page-body'>
        <div className='left-half'>
          <Sidebar />
        </div>
        <div className='right-half'>
          <div>
            <div>
              <GraphSpace />
            </div>
            <div>
              <QuestSpace />
            </div>
          </div>
          <div>
            <LastAlerts />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherHomePage
