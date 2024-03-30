import React from 'react'
import CreateAlertsPage from '../../../Users/Shared/createAlerts.jsx'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('CreateAlertsPage Component', () => {
  const getQuestionnaire = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/`
  const getRolesList = `${process.env.REACT_APP_BACKEND_URL}/adm/rolesList`
  const getClasses = `${process.env.REACT_APP_BACKEND_URL}/adm/classes`
  const postFileToAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/file/undefined`
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
    title: 'test',
    message: 'test message'
  }]

  const fileToAlertResponse = {
    status: 200,
    type: 'cors',
    statusText: 'OK',
    headers: {
      'content-length': 7832,
      'content-type': 'image/jpeg'
    },
    ok: true,
    redirected: false,
    url: 'https://localhost:8080/user/file/123',
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
        <BrowserRouter>
          <WebsocketProvider>
            <CreateAlertsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const rolesLabel = screen.getByLabelText("Type d'utilisateur visé:")
    await waitFor(async () => {
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
        <BrowserRouter>
          <WebsocketProvider>
            <CreateAlertsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    // const errorMessage = screen.getByText('Erreur lors de la récupération des classes')
    // await waitFor(async () => {
    //   expect(errorMessage).toBeInTheDocument()
    // })

    const sendButton = screen.getByText("Envoyer l'alerte")
    await waitFor(async () => {
      expect(sendButton).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(sendButton)
    })
  })

  it('shows and hides roles and classes', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <CreateAlertsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const rolesBtn = screen.getByText('Rôles')
    await waitFor(async () => {
      expect(rolesBtn).toBeInTheDocument()
    })
    const classesBtn = screen.getByText('Classes')
    await waitFor(async () => {
      expect(classesBtn).toBeInTheDocument()
    })
    await act(async () => {
      fireEvent.click(rolesBtn)
    })
    await act(async () => {
      fireEvent.click(classesBtn)
    })
  })

  it('sends an alert without a file and then with it', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <CreateAlertsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const rolesSelect = screen.getByTestId('roles-select')
    await waitFor(async () => {
      expect(rolesSelect).toBeInTheDocument()
    })

    await waitFor(async () => {
      expect(rolesSelect.value).toBe('0')
    })
    await act(async () => {
      fireEvent.change(rolesSelect, { target: { value: '1' } })
    })
    await waitFor(async () => {
      expect(rolesSelect.value).toBe('1')
    })

    const classesBtn = screen.getByText('Classes')
    await waitFor(async () => {
      expect(classesBtn).toBeInTheDocument()
    })
    await act(async () => {
      fireEvent.click(classesBtn)
    })
    await act(async () => {
      fireEvent.click(classesBtn)
    })

    const checkbox200 = screen.getByTestId('class-check-0')
    await waitFor(async () => {
      expect(checkbox200).toBeInTheDocument()
    })
    await act(async () => {
      fireEvent.click(checkbox200)
    })

    const alertTitle = screen.getByTestId('alert-title')
    await waitFor(async () => {
      expect(alertTitle).toBeInTheDocument()
    })
    await act(async () => {
      fireEvent.change(alertTitle, { target: { value: 'test' } })
    })
    await waitFor(async () => {
      expect(alertTitle).toHaveValue('test')
    })

    const alertMessage = screen.getByTestId('alert-message')
    await waitFor(async () => {
      expect(alertMessage).toBeInTheDocument()
    })
    await act(async () => {
      fireEvent.change(alertMessage, { target: { value: 'test message' } })
    })
    await waitFor(async () => {
      expect(alertMessage).toHaveValue('test message')
    })

    const fileInput = screen.getByTestId('alert-file-input')
    await waitFor(async () => {
      expect(fileInput).toBeInTheDocument()
    })
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [{ file: 'image' }] } })
    })

    const sendButton = screen.getByText("Envoyer l'alerte")
    await waitFor(async () => {
      expect(sendButton).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(sendButton)
    })
  })
})
