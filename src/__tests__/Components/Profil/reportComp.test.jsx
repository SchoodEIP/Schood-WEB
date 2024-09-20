import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import fetchMock from 'fetch-mock'
import { WebsocketProvider } from '../../../contexts/websocket'
import { MemoryRouter } from 'react-router-dom'
import { disconnect } from '../../../functions/disconnect'
import ReportComp from '../../../Components/Profil/reportComp'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('reportComp', () => {
  const reportUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/report?id=123`

  const reports = [{
    createdAt: '2024-02-24T00:00:00.000Z',
    facility: '0',
    message: 'Ceci est un signalement',
    seen: 'false',
    signaledBy: {
      _id: '1',
      firstName: 'Marie',
      lastName: 'Leclerc',
      email: 'marie.leclerc.Schood1@schood.fr',
      role: '1'
    },
    type: 'other',
    usersSignaled: [{
      _id: '0',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson.Schood1@schood.fr',
      role: '0'
    }],
    _id: 0
  }]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(reportUrl, reports)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('shows a report', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <ReportComp id={123} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })
  })

  it('receives no reports', async () => {
    fetchMock.get(reportUrl, [])

    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <ReportComp id={123} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const message = await screen.getByText('Aucun signalement à déclarer')
    await waitFor(async () => {
      expect(message).toBeInTheDocument()
    })
  })

  it('disconnects reports url', async () => {
    fetchMock.get(reportUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <ReportComp id={123} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(async () => {
      expect(disconnect).toBeCalled()
    })
  })
})
