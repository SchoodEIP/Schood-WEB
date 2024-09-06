import React from 'react'
import AlertsPage from '../../../Users/Shared/alertsPage.jsx'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('AlertsPage Component', () => {
  const getQuestionnaire = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/`
  const getRolesList = `${process.env.REACT_APP_BACKEND_URL}/shared/roles`
  const getClasses = `${process.env.REACT_APP_BACKEND_URL}/shared/classes`
  const postFileToAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/file/undefined`
  const getAlerts = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/`
  const getFile = `${process.env.REACT_APP_BACKEND_URL}/user/file/123`

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

  const alertList = [
    {
      _id: 123,
      title: 'test',
      message: 'test message'
    },
    {
      _id: 457,
      title: 'test2',
      message: 'test2 message',
      file: '123'
    }
  ]

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

  const dummyBlob = new Blob(['dummy content'], { type: 'text/plain' })

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(getQuestionnaire, forms)
    fetchMock.get(getRolesList, { roles })
    fetchMock.get(getClasses, classes)
    fetchMock.get(getAlerts, alertList)
    fetchMock.post(postFileToAlert, fileToAlertResponse)
    fetchMock.get(getFile, {
      status: 200,
      statusText: 'OK',
      body: dummyBlob
    })
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('renders the page', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AlertsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const rolesLabel = screen.getByText('Mes Alertes')
    await waitFor(async () => {
      expect(rolesLabel).toBeInTheDocument()
    })
  })

  it('checks disconnect', async () => {
    fetchMock.get(getAlerts, { status: 401 })
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AlertsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(async () => {
      expect(window.location.pathname).toBe('/')
    })
  })

  it('retrieves the id param and navigates correctly', async () => {
    const setHref = jest.fn()
    const originalLocation = window.location

    delete window.location
    window.location = {
      ...originalLocation,
      get href() { return ''; },  // Add the getter for href
      set href(url) { setHref(url); },  // Mock the setter for href
    };
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/alerts/123']}>
          <WebsocketProvider>
            <AlertsPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    // Wait for the component to fully render
    await waitFor(() => {
      // Check if the alert with id '123' is rendered correctly
      const voirPlusBtn = screen.getByTestId('123')
      expect(voirPlusBtn).toBeInTheDocument()
    })

    // Simulate user clicking on the 'Voir plus' button for the alert with id '123'
    const voirPlusBtn = screen.getByTestId('123')
    await act(async () => {
      fireEvent.click(voirPlusBtn)
    })

    // Verify that window.location.href is called with the correct URL
    expect(setHref).toHaveBeenCalledWith('/alerts/123')

    // Restore the original window.location
    setHref.mockRestore()

    window.location = originalLocation;
  })

  it('navigates correctly', async () => {
    const setHref = jest.fn()
    const originalLocation = window.location

    delete window.location
    window.location = {
      ...originalLocation,
      get href() { return ''; },  // Add the getter for href
      set href(url) { setHref(url); },  // Mock the setter for href
    };

    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <AlertsPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    // Wait for the component to fully render
    await waitFor(() => {
      // Check if the alert with id '123' is rendered correctly
      const voirPlusBtn = screen.getByTestId('123')
      expect(voirPlusBtn).toBeInTheDocument()
    })

    // Simulate user clicking on the 'Voir plus' button for the alert with id '123'
    const voirPlusBtn = screen.getByTestId('123')
    await act(async () => {
      fireEvent.click(voirPlusBtn)
    })

    // Verify that window.location.href is called with the correct URL
    expect(setHref).toHaveBeenCalledWith('/alerts/123')

    // Restore the original window.location
    setHref.mockRestore()
    window.location = originalLocation;
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
            <AlertsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    // const errorMessage = screen.getByText('Erreur lors de la récupération des classes')
    // await waitFor(async () => {
    //   expect(errorMessage).toBeInTheDocument()
    // })

    const sendButton = screen.getByText('Créer une alerte')
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
            <AlertsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const sendButton = screen.getByText('Créer une alerte')
    await waitFor(async () => {
      expect(sendButton).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(sendButton)
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('close-img'))
    })
  })

  it('shows and hides roles and classes', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AlertsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const sendButton = screen.getByText('Créer une alerte')
    await waitFor(async () => {
      expect(sendButton).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(sendButton)
    })

    const rolesBtn = screen.getByText('Utilisateurs Visés')
    await waitFor(async () => {
      expect(rolesBtn).toBeInTheDocument()
    })
    const classesBtn = screen.getByText('Classe(s) visée(s)')
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
            <AlertsPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const createButton = screen.getByText('Créer une alerte')
    await waitFor(async () => {
      expect(createButton).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(createButton)
    })
    const rolesBtn = screen.getByText('Utilisateurs Visés')
    await waitFor(async () => {
      expect(rolesBtn).toBeInTheDocument()
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

    const classesBtn = screen.getByText('Classe(s) visée(s)')
    await waitFor(async () => {
      expect(classesBtn).toBeInTheDocument()
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

    const alertTitle = screen.getByPlaceholderText('Titre')
    await waitFor(async () => {
      expect(alertTitle).toBeInTheDocument()
    })
    await act(async () => {
      fireEvent.change(alertTitle, { target: { value: 'test' } })
    })
    await waitFor(async () => {
      expect(alertTitle).toHaveValue('test')
    })

    const alertMessage = screen.getByPlaceholderText('Message')
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

    const sendButton = screen.getByText('Créer une alerte')
    await waitFor(async () => {
      expect(sendButton).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(sendButton)
    })
  })

  it('handles a 401 status code by calling disconnect for alerts', async () => {
    fetchMock.get(getAlerts, 401)
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/alerts']}>
          <WebsocketProvider>
            <AlertsPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('handles a 401 status code by calling disconnect for getFile', async () => {
    fetchMock.get(getFile, 401)
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/alerts']}>
          <WebsocketProvider>
            <AlertsPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })
})
