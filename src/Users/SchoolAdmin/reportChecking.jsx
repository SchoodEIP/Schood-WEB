import React, { useState, useEffect } from 'react'
import '../../css/pages/homePage.css'
import '../../css/pages/reportChecking.scss'
import HeaderComp from '../../Components/Header/headerComp'
import Sidebar from '../../Components/Sidebar/sidebar'

const ReportChecking = () => {
    const [reportRequests, setReportRequests] = useState([
      // Exemple de données statiques
      { id: 1, title: 'Rapport 1' },
      { id: 2, title: 'Rapport 2' },
      // Ajoutez d'autres données statiques si nécessaire
    ]);
  
    const [selectedReport, setSelectedReport] = useState({
      // Exemple de données statiques pour la démo
      id: 1,
      conversation: 'Contenu de la conversation signalée...',
    });
  
    const [isReportProcessed, setIsReportProcessed] = useState(false);
    const [error, setError] = useState('');

// const ReportChecking = () => {
//   const [reportRequests, setReportRequests] = useState([]);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [isReportProcessed, setIsReportProcessed] = useState(false);
//   const [error, setError] = useState('');

  const fetchReportRequests = async () => {
    try {
      const response = await fetch('shared/report');
      const data = await response.json();
      setReportRequests(data);
    } catch (error) {
      setError('Erreur lors de la récupération des demandes de signalement.');
    }
  };

  const fetchReportedConversation = async (reportId) => {
    try {
      const response = await fetch(`shared/report/${reportId}`);
      const data = await response.json();
      setSelectedReport(data);
    } catch (error) {
      setError('Erreur lors de la récupération de la conversation signalée.');
    }
  };

  const checkReportProcessingStatus = async (reportId) => {
    try {
      const response = await fetch(`shared/report/${reportId}`);
      const data = await response.json();
      setIsReportProcessed(data.processed);
    } catch (error) {
      setError('Erreur lors de la vérification du statut de traitement.');
    }
  };

  const handleReportProcessing = async (reportId, isProcessed) => {
    try {
      await fetch(`shared/report/${reportId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ processed: isProcessed }),
      });
      setIsReportProcessed(isProcessed);
    } catch (error) {
      setError('Erreur lors du traitement de la demande.');
    }
  };

  const handleReportSelection = async (reportId) => {
    await fetchReportedConversation(reportId);
    await checkReportProcessingStatus(reportId);
  };

  useEffect(() => {
    fetchReportRequests();
  }, []);

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
                {reportRequests.map((report) => (
                <li key={report.id} onClick={() => handleReportSelection(report.id)}>
                    {report.title}
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
                <button onClick={() => handleReportProcessing(selectedReport.id, true)}>Valider</button>
                <button onClick={() => handleReportProcessing(selectedReport.id, false)}>Supprimer</button>
                </div>
            )}

            {/* Affichage du statut de traitement */}
            {isReportProcessed && <p>La demande a été traitée.</p>}
            {!isReportProcessed && <p>La demande n'a pas encore été traitée.</p>}

            {/* Affichage d'un message d'erreur en cas de problème */}
            {error && <p className='error-message'>{error}</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportChecking;
