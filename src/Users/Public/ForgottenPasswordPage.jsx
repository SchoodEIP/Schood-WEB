import React, { useState } from 'react'

import './ForgottenPasswordPage.scss'
import logoSchood from '../../assets/logo_schood.png'
import childrenLogin from '../../assets/children_login.png'

export default function ForgottenPasswordPage () {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const baseUrl = 'http://localhost:8080/user/requestPassword'

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

      const data = await response.json()

      if (response.ok) {
        setMessage(`${data.message}`)
      } else {
        setMessage(`Error: ${data.message}`)
      }
    } catch (error) {
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
    <div className='request-page'>
      <div id='background-part'>
        <img id='childrenImg' src={childrenLogin} alt='children' />
      </div>
      <div id='request-part'>
        <img id='schoodLogo' src={logoSchood} alt='Schood' />
        <div id='request-form'>
          <form>
            <div>
              <input id='mailInput' type='text' placeholder='Email' onChange={handleEmailChange} value={email} required />
            </div>
          </form>
        </div>
        <div>
          <button onClick={handleRequest} type='submit' id='request-button'>Demander un nouveau mot de passe</button>
        </div>
        <div>
          <p id='errorMessage'>{message}</p>
        </div>
        <div>
          <a href='/'>Retour à l'accueil</a>
        </div>
      </div>
    </div>
  )
}
