import React from 'react'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ReportSidebar from '../../../Components/reports/reportSidebar'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('Feelings Component', () => {
  const setCurrentReportMock = jest.fn()
  const handleReportSelectionMock = jest.fn()
  const reportsMock = [
    { _id: '1', conversation: '12', type: 'bullying' },
    { _id: '2', type: 'other', conversation: 'Conversation 2' }
  ]
  const currentReportMock = reportsMock[0]
  beforeEach(() => {
    fetchMock.reset()
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportSidebar reports={reportsMock} currentReport={currentReportMock} setCurrentReport={setCurrentReportMock} handleReportSelection={handleReportSelectionMock} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    expect(screen.getByText('Harcèlement')).toBeInTheDocument()
    expect(screen.getByText('Autre')).toBeInTheDocument()
  })

  it('clicks on a report', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportSidebar reports={reportsMock} currentReport={currentReportMock} setCurrentReport={setCurrentReportMock} handleReportSelection={handleReportSelectionMock} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    await act(() => {
      fireEvent.click(screen.getByText('Autre'))
    })

    await waitFor(() => {
      expect(setCurrentReportMock).toHaveBeenCalledWith(reportsMock[1])
      expect(handleReportSelectionMock).toHaveBeenCalledWith(reportsMock[1]._id, reportsMock[1].conversation)
    })

    await act(() => {
      fireEvent.click(screen.getByText('Harcèlement'))
    })
  })
})
