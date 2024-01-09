import React from 'react'
import CreateAlerts from '../../Components/Alerts/createAlerts'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import '../../css/pages/createAlerts.scss'

const CreateAlertsPage = () => {
  return (
    <div className='alert-container'>
      <div>
        <HeaderComp />
      </div>
      <div className='different-page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='left-half'>
          <div><CreateAlerts /></div>
        </div>
      </div>
    </div>
  )
}

export default CreateAlertsPage
