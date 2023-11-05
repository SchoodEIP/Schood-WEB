import React from 'react'
import '../../css/Components/Popup/popup.css'
import {FaTimes} from "react-icons/fa"

export default function Popup (props) {
  return (
    <div id='popup-box'>
      <div id='p-box'>
        <div className='pop-content'>
          <div className='pop-header'>
            <button className='btn-close' onClick={props.handleClose}><FaTimes size={24} /></button>
            <h2>{props.title}</h2>
          </div>
          <div className='pop-body'>
            {props.content}
            <p data-testid='err-message' id='err-message'>{props.errMessage}</p>
            <button className='account-submit-btn' type='submit' onClick={props.handleCreation}>{props.btn_text}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
