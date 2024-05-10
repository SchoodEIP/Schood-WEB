import React, { useState, useEffect } from 'react'
import '../../css/pages/homePage.scss'
import '../../css/pages/reportChecking.scss'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'
import ReportSidebar from '../../Components/reports/reportSidebar'
import Message from '../../Components/ChatRoom/message'
import UserProfile from '../../Components/userProfile/userProfile'
import { disconnect } from '../../functions/sharedFunctions'

const ReportChecking = () => {
  const [reports, setReports] = useState([])
  const [currentReport, setCurrentReport] = useState('')
  const [reportedConversation, setReportedConversation] = useState(null)
  const [reportedConversationMessages, setReportedConversationMessages] = useState(null)
  const [isReportProcessed, setIsReportProcessed] = useState(false)
  const [error, setError] = useState('')

  const fetchReportRequests = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 403) {
        disconnect();
      }
      const data = await response.json()
      setReports(data)
      setCurrentReport(data[data.length - 1])
    } catch (error) /* istanbul ignore next */ {
      setError('Erreur lors de la récupération des demandes de signalement.')
    }
  }

  const fetchReportedConversation = async (conversationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat/${conversationId}`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 403) {
        disconnect();
      }
      const data = await response.json()
      if (!data.message) { setReportedConversation(data) }
    } catch (error) /* istanbul ignore next */ {
      setError('Erreur lors de la récupération de la conversation signalée.')
    }
  }

  const fetchReportedConversationMessages = async (conversationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 403) {
        disconnect();
      }
      const data = await response.json()
      if (!data.message) { setReportedConversationMessages(data) }
    } catch (error) /* istanbul ignore next */ {
      setError('Erreur lors de la récupération de la conversation signalée.')
    }
  }

  /* const checkReportProcessingStatus = async (reportId) => {
    // on a pas moyen de vérifier le status d'un report, la route ci dessous n'est pas valide
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report/${reportId}`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setIsReportProcessed(data.processed)
    } catch (error) {
      setError('Erreur lors de la vérification du statut de traitement.')
    }
  } */

  /* const handleReportProcessing = async (reportId, isProcessed) => {
    try {
      if (isProcessed) {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report/${reportId}`, {
          method: 'POST',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ processed: true })
        })
      } else {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report/${reportId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        setReportRequests((prevReports) => prevReports.filter((report) => report._id !== reportId))
      }

      setIsReportProcessed(isProcessed)
    } catch (error){
      setError('Erreur lors du traitement de la demande.')
    }
  } */

  const handleReportSelection = async (reportId, conversationId) => {
    await fetchReportedConversation(conversationId)
    await fetchReportedConversationMessages(conversationId)
    // await checkReportProcessingStatus(reportId)
  }

  useEffect(() => {
    fetchReportRequests()
  }, [])

  return (
    <div className='messaging-page'>
      <div className='header'>
        <HeaderComp
          title='Mes messages'
        />
      </div>
      <div className='content'>
        <div className='messaging-page'>
          <ReportSidebar
            reports={reports}
            currentReport={currentReport}
            setCurrentReport={setCurrentReport}
            handleReportSelection={handleReportSelection}
          />

          <div className='chat'>
            {currentReport
              ? (
                <div className='chat-content'>
                  <div className='top'>
                    <div className='conv-name'>{currentReport.userSignaled.firstname}</div>
                  </div>
                  {
                    currentReport.message && (
                      <div className='report-message'>{currentReport.message}</div>
                    )
                  }
                  {
                    reportedConversationMessages && (
                      <div className='bottom'>
                        <div className='left'>
                          <div className='top2'>
                            <div className='message-list'>
                              {reportedConversationMessages.map((message, index) => (
                                <Message key={index} message={message} participants={reportedConversation.participants} />
                              ))}
                              {error && <div className='error-message'>{error}</div>}
                            </div>
                          </div>
                        </div>
                        <div className='right'>
                          {currentReport.participants.map((participant, indexP) => (
                            <div className='user-profile' key={indexP}>
                              <UserProfile
                                fullname
                                profile={participant}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }

                </div>
                )
              : (
                <div>Aucun signalement sélectionné.</div>
                )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportChecking
