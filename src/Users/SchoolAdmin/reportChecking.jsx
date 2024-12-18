import React, { useState, useEffect } from 'react'
import '../../css/pages/homePage.scss'
import '../../css/pages/reportChecking.scss'
import HeaderComp from '../../Components/Header/headerComp'
import ReportSidebar from '../../Components/reports/reportSidebar'
import UserProfile from '../../Components/userProfile/userProfile'
import { disconnect } from '../../functions/disconnect'
import { translate } from '../../functions/translate'
import { toast } from 'react-toastify'
import Popup from 'reactjs-popup'
import cross from '../../assets/Cross.png'
import chatIcon from '../../assets/chatIcon.png'
import AccessingReportedConversationPopupContent from '../../Components/Popup/accessingReportedConversation'

const ReportChecking = () => {
  const [reports, setReports] = useState([])
  const [currentReport, setCurrentReport] = useState('')
  const [showTreated, setShowTreated] = useState(false)
  const [reportedConversation, setReportedConversation] = useState(null)
  const [isAccessing, setIsAccessing] = useState(false)
  const [signaledBy, setSignaledBy] = useState([])

  const handleCurrentReport = (report) => {
    setCurrentReport(report)
    setSignaledBy(report.signaledBy)
    if (report.conversation) {
      setReportedConversation(report.conversation)
    } else {
      setReportedConversation(null)
    }
  }

  const handleShowTreated = (result) => {
    setShowTreated(result)
  }

  const fetchReportRequests = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 401) {
        disconnect()
      }
      const data = await response.json()
      setReports(data)
      setCurrentReport(data[data.length - 1])
      if (data[data.length - 1].conversation) {
        setReportedConversation(data[data.length - 1].conversation)
        setSignaledBy(data[data.length - 1].signaledBy)
      }
    } catch (error) /* istanbul ignore next */ {
      toast.error('Erreur lors de la récupération des demandes de signalement.')
    }
  }

  const handleReportProcessing = async (reportId, isProcessed) => {
    if (isProcessed === 'processed') {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report/processing/${reportId}`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'responded', responseMessage: 'ok' })
      }).then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        if (response.status === 200) {
          toast.success('Le signalement est traité.')
        }
      })
        .catch((error) => {
          toast.error('Un problème est survenu, le signalement ne peut être traité.', error.message)
        })
    } else if (isProcessed === 'waiting') {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report/processing/${reportId}`, {
        method: 'POST',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'unseen', responseMessage: 'ok' })
      }).then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        if (response.status === 200) {
          toast.success('Le signalement a été mis en attente.')
        }
      })
        .catch((error) => {
          toast.error('Un problème est survenu, le signalement ne peut être traité.', error.message)
        })
    } else {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report/${reportId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (response.status === 401) {
          disconnect()
        }
        if (response.status === 200) {
          toast.success('Le signalement est supprimé.')
        }
      })
        .catch((error) => {
          toast.error('Un problème est survenu, le signalement ne peut être supprimé.', error.message)
        })
    }
    fetchReportRequests()
  }

  const handleAccessReportedChat = () => {
    setIsAccessing(!isAccessing)
  }

  useEffect(() => {
    fetchReportRequests()
  }, [])

  return (
    <div className='messaging-page'>
      <div className='header'>
        <HeaderComp
          title='Mes Signalements'
        />
      </div>
      <div className='content'>
        <div className='messaging-page'>
          <ReportSidebar
            reports={reports}
            currentReport={currentReport}
            handleCurrentReport={handleCurrentReport}
            showTreated={showTreated}
            handleShowTreated={handleShowTreated}
          />
          <Popup className='conversation-popup' open={isAccessing} onClose={() => setIsAccessing(false)} modal>
            {(close) => (
              <div className='popup-modal-container' style={{ alignItems: 'center' }}>
                <button className='close-btn' onClick={close}><img src={cross} alt='Close' /></button>
                <AccessingReportedConversationPopupContent signaledBy={signaledBy} reportedConversation={reportedConversation} />
              </div>
            )}
          </Popup>
          <div className='chat'>
            {currentReport
              ? (
                <div className='chat-content'>
                  <div className='top'>
                    <div className='conv-name'>{translate(currentReport.type)} {
                          reportedConversation && (
                            <img src={chatIcon} className='report-chat-icon' alt='chat' onClick={handleAccessReportedChat} title='Voir la conversation signalée' />
                          )
                        }
                    </div>
                    <div className='report-status'>{currentReport.status === 'responded'
                      ? (
                        <button style={{ fontFamily: 'Inter' }} onClick={() => handleReportProcessing(currentReport._id, 'waiting')}>Mettre en attente</button>
                        )
                      : (
                        <button style={{ fontFamily: 'Inter' }} onClick={() => handleReportProcessing(currentReport._id, 'processed')}>Traiter la requête</button>
                        )}
                      <button style={{ fontFamily: 'Inter' }} onClick={() => handleReportProcessing(currentReport._id, 'deleted')}>Supprimer la requête</button>
                    </div>
                  </div>
                  <div className='bottom'>
                    <div className='left'>
                      <div className='top2'>
                        {
                          currentReport.message && (
                            <div className='report-message'>{currentReport.message}</div>
                          )
                        }
                      </div>
                    </div>
                    <div className='right'>
                      <h3>Signalé par:</h3>
                      <div className='user-profile'>
                        <UserProfile
                          fullname
                          profile={currentReport.signaledBy}
                        />
                      </div>
                      <h3>À l'encontre de:</h3>
                      {
                        currentReport.usersSignaled.length > 0
                          ? currentReport.usersSignaled.map((user, index) => {
                            return (
                              <div key={index} className='user-profile'>
                                <UserProfile
                                  fullname
                                  profile={user}
                                />
                              </div>
                            )
                          }
                          )
                          : ''
                      }
                    </div>
                  </div>
                </div>
                )
              : (
                <div style={{ marginLeft: '10px' }}>Aucun signalement sélectionné.</div>
                )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportChecking
