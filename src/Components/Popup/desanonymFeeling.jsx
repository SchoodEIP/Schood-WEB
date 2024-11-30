import React, { useState } from 'react'
import '../../css/Components/Popup/popup.scss'
import '../../css/pages/createAlerts.scss'

const DesanonymFeelingPopupContent = ({ handleAskDesanonym }) => {
  const [message, setMessage] = useState('')

  const handleMessage = (event) => {
    console.log(event)
    setMessage(event.target.value)
  }

  return (
    <>
      <input placeholder="Message pour l'Élève..." onChange={handleMessage} type='text' value={message} />

      <button className='popup-btn' onClick={() => handleAskDesanonym(message)}>Faire la demande</button>
    </>
  )
}

export default DesanonymFeelingPopupContent
