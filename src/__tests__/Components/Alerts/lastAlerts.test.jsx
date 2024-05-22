import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { LastAlerts } from '../../../Components/Alerts/lastAlerts'
import { disconnect } from '../../../functions/disconnect'
import StudentHomePage from '../../../Users/Student/dashboardStudent'
jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('Last Alert component', () => {
  const lastAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/`
  const getFile = `${process.env.REACT_APP_BACKEND_URL}/user/file/132`
  const getStatus = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/statusLastTwo/`

  const alertList = [
    {
      title: 'Première Alerte',
      message: 'Ceci est la première alerte',
      classes: [],
      role: [],
      createdAt: '2023',
      createdBy: '0921',
      file: '',
      _id: '123'
    },
    {
      title: 'Mr Math',
      message: 'Des contacts pour le soutien scolaire se trouvent dans la partie aide',
      classes: [],
      role: [],
      createdAt: '2023',
      createdBy: '0921',
      file: '132',
      _id: '132'
    }
  ]

  const getFileResponse = {
    status: 200,
    headers: {
      'content-length': '7832',
      'content-type': 'image/jpeg'
    },
    type: 'cors',
    redirected: false,
    url: 'https://localhost:8080/user/file/abcd123',
    ok: true,
    statusText: 'OK',
    body: {
      locked: true
    }
  }

  const getFileResponseError = {
    status: 400,
    error: 'error',
    message: 'error'
  }

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(lastAlert, { body: alertList })
    fetchMock.get(getFile, getFileResponse)
    fetchMock.get(getStatus, { q1: null, q2: null })
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('should disconnect on last alert url', async () => {
    fetchMock.get(lastAlert, 401)

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <LastAlerts />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('should disconnect on get file url', async () => {
    fetchMock.get(getFile, 401)

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <LastAlerts />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('should render lastAlert', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <LastAlerts />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
  })

  it('should give an error', async () => {
    fetchMock.get(lastAlert, 403)

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <LastAlerts />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
  })

  it('should throw an alert', async () => {
    fetchMock.get(lastAlert, getFileResponseError, { status: 400 })
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <StudentHomePage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    await waitFor(() => {
      expect(screen.getByText('Mes Dernières Alertes')).toBeInTheDocument()
    })
  })

  it('should handle errors', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue({ status: 400, message: 'error' })
    jest.spyOn(global, 'fetch').mockRejectedValue({ status: 400, message: 'error' })
    jest.spyOn(global, 'fetch').mockRejectedValue({ status: 400, message: 'error' })
    jest.spyOn(global, 'fetch').mockRejectedValue({ status: 400, message: 'error' })
    jest.spyOn(global, 'fetch').mockRejectedValue({ status: 400, message: 'error' })

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <StudentHomePage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    expect(screen.getByText('Mes Questionnaires')).toBeInTheDocument()
    const downloadBtn = screen.queryByText('Télécharger le fichier')
    await waitFor(() => {
      expect(downloadBtn).not.toBeInTheDocument()
    })
  })
})
