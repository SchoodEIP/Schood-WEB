import React, { useEffect, useState } from 'react'
import '../../css/Components/Feelings/feelingsPopup.css'
import cross from "../../assets/Cross.png"
import veryBadMood from "../../assets/newVeryBadMood.png"
import badMood from "../../assets/newBadMood.png"
import averageMood from "../../assets/newAverageMood.png"
import happyMood from "../../assets/newHappyMood.png"
import veryHappyMood from "../../assets/newVeryHappyMood.png"

export default function FeelingsPopup (props) {
  const [newMood, setNewMood] = useState('')
  const [newAnonymous, setNewAnonymous] = useState(true)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (props.modify) {
      setNewMood(props.lastFeeling.feeling)
      setNewAnonymous(props.lastFeeling.isAnonymous)
      setNewMessage(props.lastFeeling.content)
    }
  }, [setNewMood, setNewAnonymous, setNewMessage, props])

  const handleFeeling = (event) => {
    event.preventDefault()

    const payload = {
      message: newMessage,
      mood: newMood,
      isAnonymous: newAnonymous,
      id: props.lastFeeling._id
    }

    if (newMood !== '') {
      props.handleClose()
      props.handleCreation(payload)
    }
  }

  const handleMood = (moodNumber) => {
    setNewMood(moodNumber)
  }

  const handleAnonymous = () => {
    setNewAnonymous(!newAnonymous)
  }

  const handleMessage = (event) => {
    setNewMessage(event.target.value)
  }


  return (
    <div id='feelings-popup-box'>
      <div id='p-box'>
        <div className='feeling-pop-content'>
          <div className="pop-header">
            <button className='btn-close' onClick={props.handleClose}>
              <img src={cross} alt="X"/>
            </button>
          </div>
          <div className='feeling-pop-body'>
              <label id="mood-label" htmlFor="mood-container">Mon humeur <span style={{color: "red"}}>*</span></label>
              <div id="mood-container">
                <div id="mood-container-0" className="emoticone-container" style={{border: newMood === 0 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 0 ? 'rgb(211, 200, 200)' : 'white'}} onClick={() => handleMood(0)} title="Très Mauvaise Humeur">
                  <img src={veryBadMood} alt="Très Mauvaise Humeur"/>
                </div>
                <div id="mood-container-1" className="emoticone-container" style={{border: newMood === 1 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 1 ? 'rgb(211, 200, 200)' : 'white'}} onClick={() => handleMood(1)} title="Mauvaise Humeur">
                  <img src={badMood} alt="Mauvaise Humeur"/>
                </div>
                <div id="mood-container-2" className="emoticone-container" style={{border: newMood === 2 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 2 ? 'rgb(211, 200, 200)' : 'white'}} onClick={() => handleMood(2)} title="Neutre">
                  <img src={averageMood} alt="Humeur Neutre"/>
                </div>
                <div id="mood-container-3" className="emoticone-container" style={{border: newMood === 3 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 3 ? 'rgb(211, 200, 200)' : 'white'}} onClick={() => handleMood(3)} title="Bonne Humeur">
                  <img src={happyMood} alt="Bonne Humeur"/>
                </div>
                <div id="mood-container-4" className="emoticone-container" style={{border: newMood === 4 ? '2px #4F23E2 solid' : '2px white solid', backgroundColor: newMood === 4 ? 'rgb(211, 200, 200)' : 'white'}} onClick={() => handleMood(4)} title="Très Bonne Humeur">
                  <img src={veryHappyMood} alt="Très Bonne Humeur"/>
                </div>
              </div>
              <label id="message-label" htmlFor="message-input">Message</label>
              <textarea id="message-input" placeholder='Message...' onChange={handleMessage} defaultValue={props.modify ? props.lastFeeling.content : ''}/>
              <div>
                <input type="checkbox" id="anonymous-checkbox" defaultChecked={props.modify ? props.lastFeeling.isAnonymous : true} onClick={handleAnonymous} />
                <label htmlFor="anonymous-checkbox" id="anonymous-label">Anonyme</label>
              </div>
            </div>
            <p data-testid='err-message' id='err-message'>{props.errMessage}</p>
            <button id='feelings-btn' type='submit' onClick={handleFeeling}>{props.modify ? 'Modifier le ressenti' : 'Créer un ressenti'}</button>
        </div>
      </div>
    </div>
  )
}
