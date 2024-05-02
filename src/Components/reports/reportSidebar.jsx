import { WebsocketContext } from '../../contexts/websocket'
import React, { useContext, useEffect } from 'react'
import cross from '../../assets/cross2.png'

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
              {report.signaledBy.lastname}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportSidebar
