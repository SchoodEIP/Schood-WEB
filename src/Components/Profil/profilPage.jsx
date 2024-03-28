import React, { useEffect, useState } from 'react'
import '../../css/pages/profilPage.scss'

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
    <div>
      {negativeResponse && <p className='error-message'>{negativeResponse}</p>}
      <div className='profil-page'>
        <h1>Profil utilisateur</h1>
        <ul>
          <li>Nom: {userProfile.firstname} {userProfile.lastname}</li>
          <li>Email: {userProfile.email}</li>
        </ul>
      </div>
    </div>
  )
}

export default ProfilPage
