import React from 'react'
import { translate } from '../../functions/sharedFunctions'

const ReportSidebar = ({
  reports,
  currentReport,
  setCurrentReport,
  handleReportSelection
}) => {
  const handleClick = (report) => {
    setCurrentReport(report)
    if (report.conversation) {
      handleReportSelection(report._id, report.conversation)
    }
  }

  return (
    <div className='chat-sidebar'>
      <div className='content'>
        {reports.map((report, index) => (
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
