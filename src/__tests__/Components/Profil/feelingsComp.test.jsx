import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import fetchMock from 'fetch-mock'
import { WebsocketProvider } from '../../../contexts/websocket'
import { MemoryRouter } from 'react-router-dom'
import { disconnect } from '../../../functions/disconnect'
import FeelingsComp from '../../../Components/Profil/feelingsComp'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('FeelingsComp', () => {
  const feelUrl = `${process.env.REACT_APP_BACKEND_URL}/user/mood?id=123`

  const feelings = [{
    _id: '0',
    mood: '2',
    date: '2024-02-24-00:00:00.000TZ',
    comment: 'This is a feeling'
  }]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(feelUrl, feelings)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('shows a feeeling', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <FeelingsComp id={123} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const message = await screen.getByText('This is a feeling')
    await waitFor(async () => {
      expect(message).toBeInTheDocument()
    })
  })

  it('receives no feeling', async () => {
    fetchMock.get(feelUrl, [])

    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <FeelingsComp id={123} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const message = await screen.getByText('Aucun ressenti à déclarer')
    await waitFor(async () => {
      expect(message).toBeInTheDocument()
    })

  })

  it('disconnects feelings url', async () => {
    fetchMock.get(feelUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <FeelingsComp id={123} />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(async () => {
      expect(disconnect).toBeCalled()
    })
  })

})