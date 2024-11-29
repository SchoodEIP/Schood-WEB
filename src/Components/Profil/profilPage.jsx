import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../css/pages/profilPage.scss'
import userIcon from '../../assets/userIcon.png'
import Popup from 'reactjs-popup'
import cross from '../../assets/Cross.png'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const ProfilPage = ({ isModif, handleProfileModification }) => {
  const [userProfile, setUserProfile] = useState({})
  const [negativeResponse, setNegativeResponse] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPicture, setNewPicture] = useState(null)

  const navigate = useNavigate() // Hook for navigation

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 401) {
        disconnect()
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setUserProfile(data)
    } catch (error) {
      setNegativeResponse('Erreur lors de la récupération du profil: ' + error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEmailChange = (e) => setNewEmail(e.target.value)

  const handlePictureChange = (event) => {
    setNewPicture(event.target.files[0])
    // const selectedFile = event.target.files[0]
    // if (selectedFile) {
    //   const reader = new FileReader()
    //   reader.readAsDataURL(selectedFile)
    //   reader.onload = () => {
    //     const base64Image = reader.result
    //     setNewPicture(base64Image)
    //   }
    //   reader.onerror = (error) => {
    //     console.error('Error occurred while reading the file:', error)
    //   }
    // }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      if (newEmail) formData.append('email', newEmail)
      if (newPicture) formData.append('file', newPicture)

      const userId = userProfile._id

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/modifyProfile/${userId}`, {
        method: 'PATCH',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: formData
      })

      if (response.status === 401) {
        disconnect()
      }

      if (!response.ok) {
        toast.error('La mise à jour du profile n\'as pas pu se faire.')
        throw new Error(`HTTP error! Status: ${response.status}`)
      } else {
        fetchData()
        toast.success('Le profil a été mis à jour avec succès')
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
          if (response.status === 200) {
            localStorage.setItem('profile', JSON.stringify(data))
            sessionStorage.setItem('profile', JSON.stringify(data))
            window.location.reload()
          } else {
            console.error(`Error: ${data.message}`)
          }
        } catch (error) {
          console.error(`Error: ${error}`)
        }
      }

      // Optionally handle non-JSON responses if needed
      const contentType = response.headers.get('Content-Type')
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        // Update the profile state with the new data
        setUserProfile(data)

        // Clear form fields and error messages
        setNewEmail('')
        setNewPicture(null)
        setNegativeResponse('')

        // Redirect to /profile
        navigate('/profile')
      } else {
        navigate('/profile')
        // const text = await response.text()
        setNegativeResponse('')
        console.log(`Erreur lors de la mise à jour du profil: ${response.statusText}`)
      }
    } catch (error) {
      navigate('/profile')
      setNegativeResponse('')
      console.log('Erreur lors de la mise à jour du profil: ' + error.message)
    }
  }

  const disconnect = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('id')
    localStorage.removeItem('profile')
    sessionStorage.removeItem('id')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('profile')
    window.location.href = '/'
  }

  return (
    <div className='page-height' style={{ height: '100%' }}>
      <Popup open={isModif} onClose={handleProfileModification} modal contentStyle={{ width: '400px' }}>
        {(close) => (
          <div className='popup-modal-container' style={{ alignItems: 'center' }}>
            <span className='popup-title'>Mettre à jour le profil</span>
            <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
            <div className='profile-update'>
              <form onSubmit={handleSubmit}>
                <div>
                  <label style={{ fontWeight: '600', marginBottom: '5px' }} htmlFor='email'>Nouvelle adresse email:</label>
                  <input
                    type='email'
                    id='email'
                    placeholder='example@example.fr'
                    value={newEmail}
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <label style={{ marginTop: '20px', fontWeight: '600', marginBottom: '5px' }} htmlFor='picture'>Nouvelle photo de profil:</label>
                  <input
                    type='file'
                    id='picture'
                    accept='.jpg, .jpeg, .png'
                    onChange={(e) => handlePictureChange(e)}
                  />
                </div>
                <button className='popup-btn' disabled={newEmail.length === 0 && !newPicture} style={{ marginTop: '20px' }} type='submit'>Mettre à jour</button>
              </form>
            </div>
          </div>
        )}
      </Popup>
      {negativeResponse && <p className='error-message'>{negativeResponse}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', height: '100%' }}>
        <div className='profile-content'>
          <div>
            <img className='profile-img' src={userProfile?.picture ? userProfile.picture : userIcon} alt='Image de profil' />
          </div>
          <div className='profile-content-container'>
            <p className='element-title'>Prénom</p>
            <p className='element-content'>{userProfile.firstname}</p>
          </div>
          <div className='profile-content-container'>
            <p className='element-title'>Nom de Famille</p>
            <p className='element-content'>{userProfile.lastname}</p>
          </div>
          <div className='profile-content-container'>
            <p className='element-title'>Rôle</p>
            <p className='element-content'>{userProfile.role?.name || 'Rôle Inconnu'}</p>
          </div>
          <div className='profile-content-container'>
            <p className='element-title'>{userProfile.classes?.length > 1 ? 'Classes' : 'Classe'}</p>
            <p className='element-content'>{userProfile.classes ? userProfile.classes.map(classe => classe.name).join(', ') : 'Aucune classe trouvée'}</p>
          </div>
          <div className='profile-content-container'>
            <p className='element-title'>Adresse email</p>
            <p className='element-content'>{userProfile.email}</p>
          </div>
        </div>
        <div style={{ marginTop: '20px' }} onClick={() => disconnect()} className='item'>
          <FontAwesomeIcon icon={faRightFromBracket} size='2xl' style={{ color: '#4f23e2' }} /> Déconnexion
        </div>
      </div>
    </div>
  )
}

export default ProfilPage
