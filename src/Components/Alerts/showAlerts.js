import { React } from 'react'
import '../../css/Components/Alerts/lastAlerts.scss'
import '../../css/pages/createAlerts.scss'
import UserProfile from '../userProfile/userProfile'

export default function ShowAlerts ({ chosenAlert }) {
  return (
    <div className='page-alert' style={{ overflowY: 'auto' }}>
      {
        chosenAlert
          ? (
            <div id='alert-message-container'>
              <div id='alert-message-header'>
                <div id='alert-message-header-content'>

                  <UserProfile
                    profile={chosenAlert?.createdBy}
                  />
                  <div id='content-information'>
                    <span>{chosenAlert?.title ? chosenAlert.title : ''}</span>
                    <span style={{ fontSize: '20px' }}>Date de Publication : {chosenAlert?.createdAt ? chosenAlert.createdAt : ''}</span>
                  </div>
                </div>
                <div>
                  {chosenAlert?.file
                    ? <button id='alert-btn'>
                      <a style={{ textDecoration: 'none', color: 'white' }} href={chosenAlert.file} target='_blank' rel='noopener noreferrer'>
                        Télécharger la pièce-jointe
                      </a>
                      </button>
                    : ''}
                </div>
              </div>
              <div id='alert-message-message'>
                {chosenAlert?.message ? chosenAlert.message : ''}
              </div>
            </div>
            )
          : <p>Cette alerte n'existe pas.</p>
      }
    </div>
  )
}
