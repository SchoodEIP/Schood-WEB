import React from 'react'
import Logo from '../../assets/schood.png'
import PowerIcon2 from '../../assets/powerIcon2.png'
import userIcon from '../../assets/userIcon.png'
import './HeaderComp.css'

export default function HeaderComp () {
  function handleClickLogout () {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
  }

  return (
    <header>
      <div className='headerComp'>
        <div>
          <img src={Logo} alt='logo' />
        </div>
        <div>
          <img className='user-icon' src={userIcon} alt='User' />
          <a href='/login' onClick={handleClickLogout}>
            <img className='power-icon' src={PowerIcon2} alt='Disconnect' />
          </a>
        </div>
      </div>
    </header>
  )
}
