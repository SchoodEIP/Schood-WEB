import React, { useEffect, useState } from 'react'
import { disconnect } from '../../functions/disconnect'
import userIcon from '../../assets/userIcon.png'
import '../../css/pages/profilPage.scss'

export default function ProfileComp ({ profile }) {
  const [classesList, setClassesList] = useState([])
  const [rolesList, setRolesList] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [updatedUser, setUpdatedUser] = useState({
    email: profile?.email || '',
    picture: null
  })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/classes`, {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        if (response.status === 401) {
          disconnect()
        }

        if (!response.ok) /* istanbul ignore next */ {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setClassesList(data)
      } catch (error) /* istanbul ignore next */ {
        console.error('Erreur lors de la récupération du profil', error.message)
      }
    }

    const fetchRoles = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/roles`, {
          method: 'GET',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        if (response.status === 401) {
          disconnect()
        }

        if (!response.ok) /* istanbul ignore next */ {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setRolesList(data.roles)
      } catch (error) /* istanbul ignore next */ {
        console.error('Erreur lors de la récupération du profil', error.message)
      }
    }

    fetchRoles()
    fetchClasses()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUpdatedUser(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    setUpdatedUser(prevState => ({
      ...prevState,
      picture: e.target.files[0]
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('email', updatedUser.email)
      if (updatedUser.picture) {
        formData.append('file', updatedUser.picture)
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/modifyProfile/${profile._id}`, {
        method: 'PATCH',
        headers: {
          'x-auth-token': sessionStorage.getItem('token')
        },
        body: formData
      })

      if (response.status === 401) {
        disconnect()
      } else if (response.ok) {
        setIsEditing(false)
        // Update the profile data if needed
        window.location.reload()
      } else {
        const text = await response.text()
        console.error('Erreur lors de la mise à jour du profil:', text)
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error.message)
    }
  }

  return (
    <div className='profile-component-container'>
      <h3 className='profile-component-title'>Informations</h3>
      <div className='profile-component-content-container'>
        <div className='profile-information-container'>
          <div className='profile-content-container'>
            <p className='profile-element-title'>Nom</p>
            <p className='profile-element-content'>{profile ? `${profile.firstname || ''} ${profile.lastname || ''}` : ''}</p>
          </div>
          <div className='profile-content-container'>
            <p className='profile-element-title'>Rôle</p>
            <p className='profile-element-content'>{(profile?.role && rolesList) ? rolesList.find(role => profile.role === role._id)?.frenchName : 'Rôle Inconnu'}</p>
          </div>
          <div className='profile-content-container'>
            <p className='profile-element-title'>{profile?.classes?.length > 1 ? 'Classes' : 'Classe'}</p>
            <p className='profile-element-content'>{profile?.classes?.length >= 1 ? profile.classes.map((classe, index) => { return classesList.find(classes => classes._id === classe)?.name }).join(', ') : 'Aucune classe trouvée'}</p>
          </div>
          <div className='profile-content-container'>
            <p className='profile-element-title'>Adresse email</p>
            <p className='profile-element-content'>{profile?.email}</p>
          </div>
        </div>
        <div className='profile-img-container'>
          <img className='profile-img' src={profile?.picture ? profile.picture : userIcon} alt='user_icon' />
        </div>
      </div>

      {isEditing
        ? (
          <div className='editProfileForm'>
            <h2>Modifier Profil</h2>
            <form onSubmit={handleUpdate}>
              <div>
                <label htmlFor='email'>Email:</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={updatedUser.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor='picture'>Photo de profil:</label>
                <input
                  type='file'
                  id='picture'
                  onChange={handleFileChange}
                />
              </div>
              <button type='submit'>Mettre à jour</button>
              <button type='button' onClick={() => setIsEditing(false)}>Annuler</button>
            </form>
          </div>
          )
        : (
          <button onClick={() => setIsEditing(true)}>Modifier Profil</button>
          )}
    </div>
  )
}
