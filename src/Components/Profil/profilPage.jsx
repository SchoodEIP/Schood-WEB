import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../css/pages/profilPage.scss'
import userIcon from '../../assets/userIcon.png'
import { disconnect } from '../../functions/disconnect'

const ProfilPage = () => {
  const [userProfile, setUserProfile] = useState({})
  const [negativeResponse, setNegativeResponse] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPicture, setNewPicture] = useState(null)

  const navigate = useNavigate() // Hook for navigation

  useEffect(() => {
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

    fetchData()
  }, [])

  const handleEmailChange = (e) => setNewEmail(e.target.value)
  const handlePictureChange = (e) => setNewPicture(e.target.files[0])

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
        throw new Error(`HTTP error! Status: ${response.status}`)
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
        const text = await response.text()
        setNegativeResponse('')
        console.log(`Erreur lors de la mise à jour du profil: ${text}`)
      }
    } catch (error) {
      navigate('/profile')
      setNegativeResponse('')
      console.log('Erreur lors de la mise à jour du profil: ' + error.message)
    }
  }

  return (
    <div className='page-height'>
      {negativeResponse && <p className='error-message'>{negativeResponse}</p>}
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

        <div className='profile-update'>
          <h2>Mettre à jour le profil</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor='email'>Nouvelle adresse email:</label>
              <input
                type='email'
                id='email'
                value={newEmail}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label htmlFor='picture'>Nouvelle photo de profil:</label>
              <input
                type='file'
                id='picture'
                onChange={handlePictureChange}
              />
            </div>
            <button type='submit'>Mettre à jour</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilPage
