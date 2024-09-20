import React, { useEffect, useState } from 'react'
import { disconnect } from '../../functions/disconnect'
import '../../css/pages/profilPage.scss'
import UserProfile from '../userProfile/userProfile'
import { translate } from '../../functions/translate'

export default function ReportComp ({ id }) {
  const [reportsList, setReportsList] = useState([])

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report?id=` + id, {
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
        setReportsList(data)
      } catch (error) /* istanbul ignore next */ {
        console.error('Erreur lors de la récupération du profil', error.message)
      }
    }

    fetchReports()
  }, [id])

  return (
    <div className='profile-component-container'>
      <h3>Signalements</h3>
      <div className='report-content'>
        {reportsList.length > 0
          ? reportsList.map((report, index) => (
            <div className='report-container' key={index}>
              <div className='report-top-container'>
                <h4>{translate(report.type)}</h4>
                <div className='top-profile-container' title={report.signaledBy.firstname + ' ' + report.signaledBy.lastname}>
                  <UserProfile profile={report.signaledBy} fullname />
                </div>
              </div>
              <div className='report-middle-container'>
                <p>{report.message}</p>
              </div>
              <div className='report-bottom-container'>
                <h4>Utilisateurs signalés</h4>
                {
                  report.usersSignaled.map((user, indexP) =>
                    <div className='user-signaled-container' key={indexP} title={user.firstname + ' ' + user.lastname}>
                      <UserProfile profile={user} fullname />
                    </div>
                  )
                }
              </div>
            </div>
          )
          )
          : <span style={{ marginLeft: '15px' }}>Aucun signalement à déclarer</span>}
      </div>
    </div>
  )
}
