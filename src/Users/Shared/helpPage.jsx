import '../../css/pages/homePage.css'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import AidePage from '../../Components/Aides/aides'
import React from 'react'

const HelpPage = () => {
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
            <AidePage />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
