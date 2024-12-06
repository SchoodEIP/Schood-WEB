import React from 'react'
import { translate } from '../../functions/translate'

const ReportSidebar = ({
  reports,
  currentReport,
  handleCurrentReport,
  showTreated,
  handleShowTreated
}) => {
  const handleClick = (report) => {
    handleCurrentReport(report)
  }

  return (
    <div className='chat-sidebar'>
      <div className='report-sidebar-header'>
        <div className={`report-sidebar-button ${showTreated ? '' : 'blue-filler'}`} style={{ width: '60%' }} onClick={() => handleShowTreated(false)}>En Attente</div>
        <div className={`report-sidebar-button ${showTreated ? 'blue-filler' : ''}`} style={{ width: '40%' }} onClick={() => handleShowTreated(true)}>Traités</div>
      </div>
      <div className='content'>
        {reports
          .filter((report) =>
            showTreated ? (report.status === 'responded') : (report.status === 'seen' || !report.status || report.status === 'unseen')
          ).map((report, index) => (
            <div key={index} className={`${report === currentReport ? 'active-conversation' : 'conversation'}`} onClick={() => handleClick(report)}>
              <div className='text'>
                {translate(report.type)}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ReportSidebar
