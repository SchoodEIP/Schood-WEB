import React, { useEffect, useState } from 'react'
import '../../css/pages/profilPage.scss'
import userIcon from '../../assets/userIcon.png'
import { disconnect } from '../../functions/disconnect'

const ProfilPage = () => {
  const [userProfile, setUserProfile] = useState({})
  const [negativeResponse, setNegativeResponse] = useState('')

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
          disconnect();
        }

        if (!response.ok) /* istanbul ignore next */ {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setUserProfile(data)
      } catch (error) /* istanbul ignore next */ {
        setNegativeResponse('Erreur lors de la récupération du profil', error.message)
      }
    }

    fetchData()
  }, [])

  return (
    <div className='page-height'>
      {negativeResponse && <p className='error-message'>{negativeResponse}</p>}
      <div className='profile-content'>
        <div>
          <img className='profile-img' src={userProfile?.picture ? userProfile.picture : userIcon} alt='Image de profile' />
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
          <p className='element-content'>{userProfile.role?.name ? userProfile.role?.name : 'Rôle Inconnu'}</p>
        </div>
        <div className='profile-content-container'>
          <p className='element-title'>{userProfile.classes?.length > 1 ? 'Classes' : 'Classe'}</p>
          <p className='element-content'>{userProfile.classes ? userProfile.classes.map((classe, index) => { return classe.name }).join(', ') : 'Aucune classe trouvée'}</p>
        </div>
        <div className='profile-content-container'>
          <p className='element-title'>Adresse email</p>
          <p className='element-content'>{userProfile.email}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilPage
