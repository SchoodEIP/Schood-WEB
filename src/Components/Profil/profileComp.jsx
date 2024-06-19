import React, { useEffect, useState } from 'react'
import { disconnect } from '../../functions/disconnect'
import userIcon from '../../assets/userIcon.png'
import '../../css/pages/profilPage.scss'

export default function ProfileComp ({ profile }) {
  const [classesList, setClassesList] = useState([])
  const [rolesList, setRolesList] = useState([])

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
    </div>
  )
}
