import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/schood.png'
import PowerIcon2 from '../../assets/powerIcon2.png'
import userIcon from '../../assets/userIcon.png'
import '../../css/Components/Header/headerComp.css'

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
          <Link to='/profil' data-testid='profil' id='profil'>
            <img className='user-icon' src={userIcon} alt='User' />
          </Link>
          <a href='/login' data-testid='logout-button' id='logout-button' onClick={handleClickLogout}>
            <img className='power-icon' src={PowerIcon2} alt='Disconnect' />
          </a>
        </div>
      </div>
    </header>
  )
}
