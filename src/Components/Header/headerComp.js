import React from 'react'
import logoSchood from '../../assets/logo_schood.png'
import '../../css/Components/Header/headerComp.css'
import { Link } from "react-router-dom";

export default function HeaderComp ({title, withLogo = true}) {
  return (
    <div id='header'>
      {title && (
        <div id='title'>
          {title}
        </div>
      )}
      {withLogo && (
        <Link to={'/'}>
          <img id='logo' src={logoSchood} alt='Schood'/>
        </Link>
      )}
    </div>
  )
}
