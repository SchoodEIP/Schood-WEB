import { React, useState } from 'react'
import '../../css/pages/authPage.scss'
import childrenLogin from '../../assets/children_login.png'
import logoSchood from '../../assets/logo_schood.png'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const baseUrl = process.env.REACT_APP_BACKEND_URL + '/user/login'

  const getRole = async (role) => {
    const authUrl = process.env.REACT_APP_BACKEND_URL + '/user/profile'

    try {
      const response = await fetch(authUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': sessionStorage.getItem('token')
        }
      })

      const data = await response.json()

      if (response.ok) {
        sessionStorage.setItem('role', data.role.name)
        localStorage.setItem('role', data.role.name)
        window.location.href = '/'
      } else {
        setMessage(`Error: ${data.message}`)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    // Vérifier que l'email est valide avant de faire la requête
    if (!validateEmail(email)) {
      setMessage('Email is not valid')
      return
    }

    // Vérifier qu'un password a été entré avant de faire la requête
    if (!password) {
      setMessage('Password is empty')
      return
    }

    const payload = {
      email,
      password
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
        sessionStorage.setItem('token', data.token)
        localStorage.setItem('token', data.token)
        getRole(data.token)
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

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  return (
    <div className='auth-page'>
      <div id='auth-background-part'>
        <img id='childrenImg' src={childrenLogin} alt='children' />
      </div>
      <div id='auth-part'>
        <img id='schoodLogo' src={logoSchood} alt='Schood' />
        <div id='auth-form'>
          <form>
            <div>
              <input className='auth-input' id='userInput' type='text' placeholder='Email' onChange={handleEmailChange} value={email} required />
            </div>
            <div>
              <input className='auth-input' id='passInput' type='password' placeholder='********' onChange={handlePasswordChange} value={password} required />
            </div>
          </form>
        </div>
        <div>
          <label id='rememberLabel'>
            <input id='rememberCheckbox' type='checkbox' /> Remember me
          </label>
        </div>
        <div>
          <button onClick={handleLogin} type='submit' id='submit-button'>Login</button>
        </div>
        <div>
          <p id='errorMessage'>{message}</p>
        </div>
        <div>
          <p id='signUpRedirect'>Forgot your password? <a href='/forgot'>Reset here.</a></p>
        </div>
      </div>
    </div>
  )
}
