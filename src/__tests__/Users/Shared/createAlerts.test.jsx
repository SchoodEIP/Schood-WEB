import React from 'react'
import CreateAlertsPage from '../../../Users/Shared/createAlerts.jsx'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('CreateAlertsPage Component', () => {
  const getQuestionnaire = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire`
  const getRolesList = `${process.env.REACT_APP_BACKEND_URL}/adm/rolesList`
  const getClasses = `${process.env.REACT_APP_BACKEND_URL}/adm/classes`
  const postFileToAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/file/123`
  const postAlerts = `${process.env.REACT_APP_BACKEND_URL}/shared/alert`

  const forms = [
    {
      _id: '123',
      title: 'Test',
      fromDate: '2023-12-24T00:00:00.000Z',
      toDate: '2023-12-30T00:00:00.000Z'
    }
  ]

  const roles = [
    {
      _id: 0,
      name: 'student',
      levelOfAccess: 0
    },
    {
      _id: 1,
      name: 'teacher',
      levelOfAccess: 1
    },
    {
      _id: 2,
      name: 'administration',
      levelOfAccess: 2
    },
    {
      _id: 3,
      name: 'admin',
      levelOfAccess: 3
    }
  ]

  const classes = [
    {
      _id: 0,
      name: '200',
      facility: '0'
    },
    {
      _id: 1,
      name: '201',
      facility: '0'
    }
  ]

  const alertList = [{
    _id: 123,
    title: "test",
    message: 'test message',
  }]

  const fileToAlertResponse = {
    status: 200,
    type: 'cors',
    statusText: "OK",
    headers: {
        "content-length": 7832,
        "content-type": "image/jpeg"
    },
    ok: true,
    redirected: false,
    url: "https://localhost:8080/user/file/123",
    body: { locked: true }

  }

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(getQuestionnaire, forms)
    fetchMock.get(getRolesList, { roles })
    fetchMock.get(getClasses, classes)
    fetchMock.post(postAlerts, alertList)
    fetchMock.post(postFileToAlert, fileToAlertResponse)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('renders the page', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <CreateAlertsPage />
        </MemoryRouter>
      )
    })

    const rolesLabel = screen.getByLabelText("Type d'utilisateur visé:")
    await waitFor(async() => {
        expect(rolesLabel).toBeInTheDocument()
    })
  })

  it('handles errors', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })

    await act(async () => {
      render(
        <MemoryRouter>
          <CreateAlertsPage />
        </MemoryRouter>
      )
    })

    const sendButton = screen.getByText("Envoyer l'alerte")
    await waitFor(async() => {
        expect(sendButton).toBeInTheDocument()
    })

    await act(async () => {
        fireEvent.click(sendButton)
    })
  })

})
