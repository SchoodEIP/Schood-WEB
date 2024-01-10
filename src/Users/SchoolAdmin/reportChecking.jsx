import React, { useState, useEffect } from 'react'
import '../../css/pages/homePage.css'
import '../../css/pages/reportChecking.scss'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'

const ReportChecking = () => {
  const [reportRequests, setReportRequests] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [isReportProcessed, setIsReportProcessed] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchReportRequests = async () => {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((data) => {
        setReportRequests(data)
      })
      .catch((error) => {
        setError('Erreur lors de la récupération des demandes de signalement.')
      })
  }

  const fetchReportedConversation = async (conversationId) => {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/chat/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'x-auth-token': sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((data) => {
        setSelectedReport(data)
      })
      .catch((error) => {
        setError('Erreur lors de la récupération de la conversation signalée.')
      })
  }

  const checkReportProcessingStatus = async (reportId) => {
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
  }

  const handleReportProcessing = async (reportId, isProcessed) => {
    try {
      if (!isProcessed) {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report/${reportId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        setReportRequests((prevReports) => prevReports.filter((report) => report._id !== reportId))
      } else {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/shared/report/${reportId}`, {
          method: 'POST',
          headers: {
            'x-auth-token': sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ processed: true })
        })
      }

      setIsReportProcessed(isProcessed)
    } catch (error) {
      setError('Erreur lors du traitement de la demande.')
    }
  }

  const handleReportSelection = async (reportId, conversationId) => {
    await fetchReportedConversation(conversationId)
    await checkReportProcessingStatus(reportId)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
  }

  const filteredReports = reportRequests.filter((report) => {
    console.log(report);
    if (filter === 'all') {
      return true
    } else if (filter === 'processed') {
      return report.processed
    } else if (filter === 'unprocessed') {
      return !report.processed
    }
    return true
  })

  useEffect(() => {
    fetchReportRequests()
  }, [])

  useEffect(() => {
    reportRequests.map((report, index) => {
      return fetchReportedConversation(report.conversation)
    })
  }, [reportRequests])

  return (
    <div>
      <div>
        <HeaderComp />
      </div>
      <div className='page-content'>
        <div>
          <Sidebar />
        </div>
        <div className='box'>
          <div className='sidebar'>
            {/* Liste de demandes de signalement */}
            <ul>
              {filteredReports.map((report) => (
                <li key={report._id} onClick={() => handleReportSelection(report._id, report.conversation)}>
                  {report.type}
                </li>
              ))}
            </ul>
          </div>
          <div className='report-details'>
            {selectedReport && (
              <div>
                <h2>Conversation Signalée</h2>
                <p>{selectedReport.conversation}</p>
                {/* Boutons pour valider/invalider la demande de signalement */}
                <button onClick={() => handleReportProcessing(selectedReport._id, true)}>Valider</button>
                <button onClick={() => handleReportProcessing(selectedReport._id, false)}>Refuser</button>
              </div>
            )}

            {/* Affichage du statut de traitement */}
            {isReportProcessed && <p>La demande a été traitée.</p>}
            {!isReportProcessed && <p>La demande n'a pas encore été traitée.</p>}

            {/* Affichage d'un message d'erreur en cas de problème */}
            {error && <p className='error-message'>{error}</p>}
          </div>
        </div>
        <div className='filter-buttons'>
          <button onClick={() => handleFilterChange('all')}>Toutes</button>
          <button onClick={() => handleFilterChange('processed')}>Traitées</button>
          <button onClick={() => handleFilterChange('unprocessed')}>Non traitées</button>
        </div>
      </div>
    </div>
  )
}

export default ReportChecking
