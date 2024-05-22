import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import ReportCreationPopupContent from '../../../Components/Popup/reportCreation'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('Report Creation Popup Content', () => {
  const usersUrl = `${process.env.REACT_APP_BACKEND_URL}/user/chat/users`
  const reportUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/report`

  const users = [
    {
      _id: '0',
      firstname: 'teacher1',
      lastname: 'teacher1',
      role: {
        _id: '0',
        name: 'teacher',
        levelOfAccess: '2'
      }
    },
    {
      _id: '1',
      firstname: 'teacher2',
      lastname: 'teacher2',
      role: {
        _id: '0',
        name: 'teacher',
        levelOfAccess: '2'
      }
    },
    {
      _id: '2',
      firstname: 'student1',
      lastname: 'student1',
      role: {
        _id: '1',
        name: 'student',
        levelOfAccess: '1'
      }
    }
  ]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(usersUrl, users)
    fetchMock.post(reportUrl, {})
    fetchMock.config.overwriteRoutes = true
    delete window.location
    window.location = { reload: jest.fn() }
    localStorage.setItem('id', '1')
  })

  afterEach(() => {
    fetchMock.restore()
  })

  test('renders  correctly', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportCreationPopupContent />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await act(() => {
      fireEvent.change(screen.getByTestId('reason-select'), { target: { value: 'spam' } })
    })

    await act(() => {
      fireEvent.change(screen.getByTestId('user-select'), { target: { value: '2' } })
    })

    await act(() => {
      fireEvent.change(screen.getByPlaceholderText('Veuillez expliquer votre raison ici.'), { target: { value: 'blah' } })
    })

    await act(() => {
      fireEvent.click(screen.getByText('Confirmer le signalement'))
    })

    expect(window.location.reload).toHaveBeenCalled()
  })

  test('checks disconnect through getusers', async () => {
    fetchMock.get(usersUrl, 401)

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportCreationPopupContent />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  test('error message', async () => {
    fetchMock.post(reportUrl, 400)

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportCreationPopupContent />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await act(() => {
      fireEvent.change(screen.getByTestId('reason-select'), { target: { value: 'spam' } })
    })

    await act(() => {
      fireEvent.change(screen.getByTestId('user-select'), { target: { value: '2' } })
    })

    await act(() => {
      fireEvent.change(screen.getByPlaceholderText('Veuillez expliquer votre raison ici.'), { target: { value: 'blah' } })
    })

    await act(() => {
      fireEvent.click(screen.getByText('Confirmer le signalement'))
    })

    await waitFor(() => {
      expect(screen.getByText('Erreur lors du signalement de la conversation.')).toBeInTheDocument()
    })
  })

  test('checks disconnect through post report', async () => {
    fetchMock.post(reportUrl, 401)

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportCreationPopupContent />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await act(() => {
      fireEvent.change(screen.getByTestId('reason-select'), { target: { value: 'spam' } })
    })

    await act(() => {
      fireEvent.change(screen.getByTestId('user-select'), { target: { value: '2' } })
    })

    await act(() => {
      fireEvent.change(screen.getByPlaceholderText('Veuillez expliquer votre raison ici.'), { target: { value: 'blah' } })
    })

    await act(() => {
      fireEvent.click(screen.getByText('Confirmer le signalement'))
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })
})
