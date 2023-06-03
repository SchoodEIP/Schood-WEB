import React from 'react'
import { LastAlerts } from '../../Components/Alerts/LastAlerts'
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/AdminMenu/index'
import './SchoolAdmHomePage.css'
import { QuestSpace } from '../../Components/Questionnaire/QuestSpace'
import { GraphSpace } from '../../Components/Graph/GraphSpace'

export default function SchoolAdmHomePage () {
  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='page-body'>
        <div className="left-half">
          <Sidebar/>
        </div>
        <div className='right-half'>
          <div>
            <div>
                <GraphSpace/>
            </div>
            <div>
              <QuestSpace/>
            </div>
          </div>
          <div>
            <LastAlerts/>
          </div>
        </div>
      </div>
    </div>
  )
}
