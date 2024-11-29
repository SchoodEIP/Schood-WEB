import React, { useState, useEffect } from 'react'
import logoSchood from '../../assets/logo_schood.png'
import '../../css/pages/authPage.scss'

export default function ForgottenPasswordPage () {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [redirectMessage, setRedirectMessage] = useState('')
  const [redirectTimer, setRedirectTimer] = useState(null)

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

      if (response.status === 200) {
        setMessage('Si un compte existe avec cet email, un nouveau mot de passe vous a été envoyé.')
        // Afficher le message de redirection et démarrer le compte à rebours
        setRedirectMessage('Vous serez redirigé vers la page de connexion dans quelques secondes.')
        const timer = setTimeout(() => {
          // Redirection vers la page de login
          window.location.href = '/' // Modifier selon votre route
        }, 6000) // 5000 ms = 5 secondes
        setRedirectTimer(timer)
      } else {
        setMessage(`Error: ${response.statusText}`)
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

  useEffect(() => {
    return () => {
      // Nettoyer le timer lors du démontage du composant
      if (redirectTimer) {
        clearTimeout(redirectTimer)
      }
    }
  }, [redirectTimer])

  return (
    <div id='auth'>
      <div id='auth-form'>
        <img id='schoodLogo' src={logoSchood} alt='Schood' />
        <div id='auth-form'>
          {redirectMessage
            ? (
              <p>{redirectMessage}</p>
              )
            : (
              <form className='auth-form'>
                <label style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', fontFamily: 'Inter', fontSize: '22px', gap: '20px', margin: '20px' }}>
                  <input style={{ border: 'none', width: '283px', height: '46px', paddingLeft: '25px', borderRadius: '26px', backgroundColor: '#FFD2D5' }} id='mailInput' type='text' placeholder='Adresse Email' onChange={handleEmailChange} value={email} required />
                </label>
                <button style={{ width: '100%', paddingLeft: '25px', paddingRight: '25px' }} onClick={handleRequest} type='submit' id='submit-button'>Demander un nouveau mot de passe</button>
              </form>
              )}
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
