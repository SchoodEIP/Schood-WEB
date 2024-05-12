import { React, useState } from 'react'
import '../../css/pages/authPage.scss'
import logoSchood from '../../assets/logo_schood.png'
import '@fontsource/inter/600.css'
import { disconnect } from '../../functions/sharedFunctions'

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

      if (response.status === 401) {
        disconnect();
      }

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('profile', JSON.stringify(data))
        localStorage.setItem('id', data._id)
        sessionStorage.setItem('role', data.role.name)
        sessionStorage.setItem('profile', JSON.stringify(data))
        localStorage.setItem('role', data.role.name)
        window.location.href = '/'
      } else /* istanbul ignore next */ {
        setMessage(`Error: ${data.message}`)
      }
    } catch (error) /* istanbul ignore next */ {
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

      if (response.status === 401) {
        disconnect();
      }

      const data = await response.json()

      if (response.ok) {
        sessionStorage.setItem('token', data.token)
        localStorage.setItem('token', data.token)
        getRole(data.token)
      } else /* istanbul ignore next */ {
        setMessage(`Error: ${data.message}`)
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

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  return (
    <div id='auth' className='page-height'>
      <div id='auth-form'>
        <img id='schoodLogo' src={logoSchood} alt='Schood' />
        <form>
          <div id='mail'>
            <div id='label'>
              Email
            </div>
            <input type='text' placeholder='email' onChange={handleEmailChange} value={email} required />
          </div>
          <div id='password'>
            <div id='label'>
              Mot de passe
            </div>
            <input type='password' placeholder='mot de passe' onChange={handlePasswordChange} value={password} required />
          </div>
        </form>
        <div id='forgot-password'>
          <a href='/forgot'>Mot de passe oublié ? Cliquez ici</a>
        </div>
        <div
          className={[
            message.length > 0 ? 'remember-me-error' : 'remember-me-normal'
          ]} id='remember-me'
        >
          <input type='checkbox' />Se rappeler de moi
        </div>
        <div>
          <p id='error-message'>{message}</p>
        </div>
        <div>
          <button onClick={handleLogin} type='submit' id='submit-button'>Connexion</button>
        </div>
      </div>
    </div>
  )
}
