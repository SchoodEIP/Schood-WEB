import React from 'react'
import logoSchood from '../../assets/logo_schood.png'
import backButton from '../../assets/backButton.png'
import '../../css/Components/Header/headerComp.scss'
import { Link, useNavigate } from "react-router-dom";

export default function HeaderComp ({title, withLogo = true, subtitle, withReturnBtn = false, position = -1, returnCall, showButtons = false, buttonComponent}) {
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
          <div id='withReturnBtn' onClick={position < 0 ? goBack : returnCall}>
            <img id='return-btn' src={backButton} alt='Return'/>
            <div id='back-text'>
              Retour
            </div>
          </div>
        )}
      </div>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '25px'}}>
        {showButtons ?
          <div style={{display: "flex", flexDirection: 'row', gap: "15px"}}>
            {buttonComponent.map((btn, index) => {
              return <button className="header-btn" key={index} onClick={btn.function}>{btn.name}</button>
            })}
          </div> : ''
        }
        {withLogo && (
          <Link to={'/'}>
            <img id='logo' src={logoSchood} alt='Schood'/>
          </Link>
        )}
      </div>
    </div>
  )
}
