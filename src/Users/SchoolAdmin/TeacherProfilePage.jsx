import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { disconnect } from '../../functions/disconnect'
import HeaderComp from '../../Components/Header/headerComp'
import ProfileComp from '../../Components/Profil/profileComp'
import StatComp from '../../Components/Profil/statComp'
import ReportComp from '../../Components/Profil/reportComp'
import FormComp from '../../Components/Profil/formComp'
import '../../css/pages/profilPage.scss'

export default function TeacherProfilePage () {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/profile?id=` + id, {
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
              setProfile(data)
            } catch (error) /* istanbul ignore next */ {
              console.error('Erreur lors de la récupération du profil', error.message)
            }
          }

          fetchData()
    }, [id])
    return (
        <div>
            <div>
                <HeaderComp
                    title={profile ? profile.firstname + ' ' + profile.lastname : 'Profile Page'}
                    withLogo
                    withReturnBtn={true}
                />
            </div>
            <div className="page-content" style={{gap:"25px"}}>
              <ProfileComp profile={profile} />
              <FormComp id={id} />
              <ReportComp id={id} />
              <StatComp id={id} />
            </div>
        </div>
    )
}