import React, { useState } from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'

const DesanonymFeelingPopupContent = ({ handleAskDesanonym }) => {
  const [message, setMessage] = useState('')

  const handleMessage = (event) => {
    setMessage(event.target.value)
  }

  return (
    <div className="edit-poup-content desanonym-popup-content">
      <h3>Demande de désanonymisation d'un ressenti</h3>
      <label className='input-label' style={{alignItems: "center"}}>
        <input placeholder="Message pour l'Élève..." onChange={handleMessage} type='text' value={message} />
      </label>
      <button className='popup-btn' style={{alignSelf: "center"}} onClick={() => handleAskDesanonym(message)}>Faire la demande</button>
    </div>
  )
}

export default DesanonymFeelingPopupContent
