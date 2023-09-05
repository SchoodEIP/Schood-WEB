import './Messages.scss'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import Messages from './Messages'
import React from 'react'

const Messagerie = () => {
  return (
    <div className='form-page'>
      <div>
        <HeaderComp />
      </div>
      <div className='different-page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='left-half'>
          <div><Messages /></div>
        </div>
      </div>
    </div>
  )
}

export default Messagerie
