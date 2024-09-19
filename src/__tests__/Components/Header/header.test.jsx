import { render, waitFor, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import HeaderComp from '../../../Components/Header/headerComp'
import { disconnect } from '../../../functions/disconnect'
import fetchMock from 'fetch-mock'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('HeaderComp', () => {
  const notifUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/notifications/`

  const notifs = [{
    date: '2024-02-24T00:00:00.000Z',
    title: 'Notif',
    message: 'This is a notif'
  }]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(notifUrl, notifs)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  test('should render title and show a notification', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <HeaderComp title='Bonjour Jacqueline' />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const logo = screen.getByText('Bonjour Jacqueline')
    await waitFor(async () => {
      expect(logo).toBeInTheDocument()
    })

    const notifBtn = screen.getByTestId('notif-btn')
    await act(async () => {
      fireEvent.click(notifBtn)
    })

    const title = screen.getByText('Notif')
    await waitFor(async () => {
      expect(title).toBeInTheDocument()
    })

    const message = screen.getByText('This is a notif')
    await waitFor(async () => {
      expect(message).toBeInTheDocument()
    })
  })

  // test('disconnect notif url', async () => {
  //   fetchMock.get(notifUrl, 401)
  //   await act(async () => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <HeaderComp title="Bonjour Jacqueline"/>
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })
  //   await waitFor(async () => {
  //     expect(disconnect).toBeCalled()
  //   })
  // })

  // test('should empty localStorage and sessionStorage', async () => {
  //   await act(async () => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <HeaderComp />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })
  //   const logout = screen.getByTestId('logout-button')
  //   expect(logout.tagName).toBe('A')

  //   window.localStorage.setItem('token', 'falseToken')
  //   window.localStorage.setItem('role', 'admin')
  //   window.sessionStorage.setItem('token', 'falseToken')
  //   window.sessionStorage.setItem('role', 'admin')
  //   expect(window.localStorage.getItem('token')).toBe('falseToken')
  //   expect(window.localStorage.getItem('role')).toBe('admin')
  //   expect(window.sessionStorage.getItem('token')).toBe('falseToken')
  //   expect(window.sessionStorage.getItem('role')).toBe('admin')

  //   fireEvent.click(screen.getByTestId('logout-button'))

  //   expect(window.localStorage.getItem('token')).toBe(null)
  //   expect(window.localStorage.getItem('role')).toBe(null)
  //   expect(window.sessionStorage.getItem('token')).toBe(null)
  //   expect(window.sessionStorage.getItem('role')).toBe(null)
  // })
})
