import React from 'react'
import '../../css/Components/Header/headerComp.css'
import logoSchood from '../../assets/logo_schood_slim.png'

export default function HeaderComp () {
  return (
    <header>
      <div>
        <div>
          <a href='/login' data-testid='menu-button' id='menu-button'>
            <img src={logoSchood} alt='logo' />
          </a>
        </div>
      </div>
    </header>
  )
}
