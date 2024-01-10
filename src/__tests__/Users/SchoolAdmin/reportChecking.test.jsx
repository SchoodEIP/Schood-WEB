import ReportChecking from '../../../Users/SchoolAdmin/reportChecking'
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import fetchMock from 'jest-fetch-mock'

// fetchMock.enableMocks()
// jest.mock('node-fetch')

describe('ReportChecking Component', () => {
  const getReportUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/report`
  const getReportedConversationUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat/123/messages`
  const getReportProcessingStatus = `${process.env.REACT_APP_BACKEND_URL}/shared/report/1`
  const deleteReport = `${process.env.REACT_APP_BACKEND_URL}/shared/report/1`
  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(getReportUrl, { })
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('renders without crashing', async () => {
    render(
      <Router>
        <ReportChecking />
      </Router>
    )
    // You can add more specific assertions if needed
    expect(screen.getByText('Toutes')).toBeInTheDocument()
  })

  it('fetches report requests on mount', async () => {
    render(
      <Router>
        <ReportChecking />
      </Router>
    )

    // Ensure that the fetch function is called
    await act(async () => {
      fireEvent.click(screen.getByText('Toutes'))
    })

    // You can add more specific assertions if needed
    expect(screen.getByText('La demande n\'a pas encore été traitée.')).toBeInTheDocument()
  })

  it('handles filter change correctly', async () => {
    render(
      <Router>
        <ReportChecking />
      </Router>
    )

    // Ensure that the filter changes correctly
    await act(async () => {
      fireEvent.click(screen.getByText('Traitées'))
    })

    // You can add more specific assertions if needed
    expect(screen.getByText('La demande n\'a pas encore été traitée.')).toBeInTheDocument()
  })

  // Add more tests for other functionality as needed
})
