import React from 'react'
import logoSchood from '../../assets/logo_schood.png'
import backButton from '../../assets/backButton.png'
import '../../css/Components/Header/headerComp.css'
import { Link, Router, useNavigate } from "react-router-dom";

export default function HeaderComp ({title, withLogo = true, subtitle, withReturnBtn = false}) {
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1)
  }

  return (
    <div id='header'>
      <div id='left'>
        {title && (
          <div id='title'>
            {title}
          </div>
        )}
        {subtitle && (
          <div id='subtitle'>
            {subtitle}
          </div>
        )}
        {withReturnBtn && (
          <div id='withReturnBtn' onClick={goBack}>
            <img id='return-btn' src={backButton} alt='Return'/>
            <div id='back-text'>
              Retour
            </div>
          </div>
        )}
      </div>
      {withLogo && (
        <Link to={'/'}>
          <img id='logo' src={logoSchood} alt='Schood'/>
        </Link>
      )}
    </div>
  )
}
