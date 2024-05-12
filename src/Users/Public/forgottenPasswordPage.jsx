import React, { useState } from 'react'
import logoSchood from '../../assets/logo_schood.png'
import '../../css/pages/authPage.scss'
import { disconnect } from '../../functions/sharedFunctions'

export default function ForgottenPasswordPage () {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const baseUrl = process.env.REACT_APP_BACKEND_URL + '/user/forgottenPassword'

  const handleRequest = async (event) => {
    event.preventDefault()

    if (!validateEmail(email)) {
      setMessage('Email is not valid')
      return
    }

    const payload = {
      email
    }

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (response.status === 403) {
        disconnect();
      }
      if (response.status === 200) {
        setMessage('Si un compte existe avec cet email, un nouveau mot de passe vous a été envoyé.')
      } else /* istanbul ignore next */ {
        setMessage(`Error: ${response.statusText}`)
      }
    } catch (error) /* istanbul ignore next */ {
      setMessage(`Error: ${error}`)
    }
  }

  const validateEmail = (email) => {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi

    return regEx.test(email)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  return (
    <div id='auth'>
      <div id='auth-form'>
        <img id='schoodLogo' src={logoSchood} alt='Schood' />
        <div id='auth-form'>
          <form>
            <label style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Inter', fontSize: '22px', gap: '20px', margin: '20px' }}>
              {/* <span style={{fontFamily: 'Inter'}}>Adresse Email <span style={{color: "red"}}>*</span></span> */}
              <input style={{ border: 'none', width: '283px', height: '46px', paddingLeft: '25px', borderRadius: '26px', backgroundColor: '#FFD2D5' }} id='mailInput' type='text' placeholder='Adresse Email' onChange={handleEmailChange} value={email} required />
            </label>
          </form>
        </div>
        <div>
          <button style={{ width: '100%', paddingLeft: '25px', paddingRight: '25px' }} onClick={handleRequest} type='submit' id='submit-button'>Demander un nouveau mot de passe</button>
        </div>
        <div>
          <p id='errorMessage'>{message}</p>
        </div>
        <div id='forgot-password'>
          <a href='/'>Retour à l'accueil</a>
        </div>
      </div>
    </div>
  )
}
