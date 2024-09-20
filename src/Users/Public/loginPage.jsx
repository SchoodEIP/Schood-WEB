import React, { useState, useRef } from 'react'
import '../../css/pages/authPage.scss'
import logoSchood from '../../assets/logo_schood.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const submitButtonRef = useRef(null)

  const baseUrl = process.env.REACT_APP_BACKEND_URL + '/user/login'

  const getRole = async (token) => {
    const authUrl = process.env.REACT_APP_BACKEND_URL + '/user/profile'

    try {
      const response = await fetch(authUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      })

      const data = await response.json()
      if (response.status === 200) {
        localStorage.setItem('profile', JSON.stringify(data))
        sessionStorage.setItem('profile', JSON.stringify(data))
        sessionStorage.setItem('role', data.role.name)
        localStorage.setItem('role', data.role.name)
        localStorage.setItem('id', data._id)
        window.location.href = '/'
      } else {
        setMessage(`Error: ${data.message}`)
        setLoading(false)
        setIsButtonActive(false)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
      setLoading(false)
      setIsButtonActive(false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    if (!validateEmail(email)) {
      setMessage("L'adresse email n'est pas valide.")
      setLoading(false)
      setIsButtonActive(false)
      return
    }

    if (!password) {
      setMessage('Le mot de passe est vide.')
      setLoading(false)
      setIsButtonActive(false)
      return
    }

    const payload = { email, password }
    setLoading(true)

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (response.status === 200) {
        sessionStorage.setItem('token', data.token)
        localStorage.setItem('token', data.token)
        getRole(data.token)
      } else {
        setMessage(`Error: ${data.message}`)
        setLoading(false)
        setIsButtonActive(false)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
      setLoading(false)
      setIsButtonActive(false)
    }
  }

  const validateEmail = (email) => {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi
    return regEx.test(email)
  }

  const handleEmailChange = (event) => setEmail(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)

  const handleKeyPressEmail = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      passwordRef.current.focus()
    }
  }

  const handleKeyPressPassword = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      setIsButtonActive(true)
      submitButtonRef.current.click()
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div id='auth' className='page-height'>
      <div id='auth-form'>
        <img id='schoodLogo' src={logoSchood} alt='Schood' />
        <form>
          <div id='mail'>
            <div id='label'>Email</div>
            <input
              type='text'
              placeholder='email'
              onChange={handleEmailChange}
              value={email}
              ref={emailRef}
              onKeyPress={handleKeyPressEmail}
              required
            />
          </div>
          <div id='password'>
            <div id='label'>Mot de passe</div>
            <div className='password-input'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='mot de passe'
                onChange={handlePasswordChange}
                value={password}
                ref={passwordRef}
                onKeyPress={handleKeyPressPassword}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className='password-toggle-icon'
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
        </form>
        <div id='forgot-password'>
          <a href='/forgot'>Mot de passe oublié ? Cliquez ici</a>
        </div>
        <div className={message.length > 0 ? 'remember-me-error' : 'remember-me-normal'} id='remember-me'>
          <input type='checkbox' />Se rappeler de moi
        </div>
        <div>
          <p id='error-message'>{message}</p>
        </div>
        <div>
          <button
            onClick={handleLogin}
            type='submit'
            id='submit-button'
            ref={submitButtonRef}
            className={loading || isButtonActive ? 'active' : ''}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Connexion'}
          </button>
        </div>
      </div>
    </div>
  )
}
