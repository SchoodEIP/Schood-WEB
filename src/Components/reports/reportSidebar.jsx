import React from 'react'
import { translate } from '../../functions/translate'

const ReportSidebar = ({
  reports,
  currentReport,
  setCurrentReport,
  handleReportSelection,
  showTreated,
  handleShowTreated
}) => {

  const handleClick = (report) => {
    setCurrentReport(report)
    if (report.conversation) {
      handleReportSelection(report._id, report.conversation)
    }
  }

  return (
    <div className='chat-sidebar'>
      <div className="report-sidebar-header">
        <div className={`report-sidebar-button ${showTreated ? 'blue-filler' : ''}`} style={{width: '40%'}} onClick={() => handleShowTreated(true)}>Traités</div>
        <div className={`report-sidebar-button ${showTreated ? '' : 'blue-filler'}`} style={{width: '60%'}} onClick={() => handleShowTreated(false)}>En Attente</div>
      </div>
      <div className='content'>
        {reports
          .filter((report) =>
            showTreated ? !report.status : report.status === 'seen'
          ).map((report, index) => (
            <div key={index} className={`${report === currentReport ? 'active-conversation' : 'conversation'}`} onClick={() => handleClick(report)}>
              <div className='text'>
                {translate(report.type)}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ReportSidebar
