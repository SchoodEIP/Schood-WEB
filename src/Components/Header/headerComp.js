import React from 'react'
import '../../css/Components/Header/headerComp.css'
import logoSchood from '../../assets/logo_schood_slim.png'

export default function HeaderComp () {
  function handleClickLogout () {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
  }

  return (
    <header>
      <div>
        <div>
          <a href='/login' data-testid='logout-button' id='logout-button' onClick={handleClickLogout}>
            <img src={logoSchood} alt='logo' />
          </a>
        </div>
      </div>
    </header>
  )
}
