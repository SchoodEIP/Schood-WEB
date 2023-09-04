import './Messages.scss'
import HeaderComp from '../../Components/Header/HeaderComp'
import Sidebar from '../../Components/Sidebar/Sidebar'
import Messages from './Messages'
import React from 'react'

const Messagerie = () => {
  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='page-body'>
        <div className='left-half'>
          <Sidebar />
        </div>
        <div className='right'>
          <div><Messages /></div>
        </div>
      </div>
    </div>
  )
}

export default Messagerie
