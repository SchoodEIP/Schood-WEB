import React from 'react'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from '../../../Components/Sidebar/sidebar'
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import fetchMock from 'fetch-mock'
// import { disconnect } from '../../../functions/disconnect'

// jest.mock('../../../functions/disconnect', () => ({
//   disconnect: jest.fn()
// }))

describe('sidebar component', () => {
  const moodUrl = `${process.env.REACT_APP_BACKEND_URL}/student/dailyMood`
  const sharedNotifUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/notifications/`

  const notif = [
    {
      concernedUser: '6638a710dd18a1e42e539476',
      date: '2024-05-06T09:46:51.804Z',
      facility: '6638a70fdd18a1e42e53944d',
      message: 'Une nouvelles alerte a été créée le Mon May 06 2024 par admin admin',
      title: 'Une nouvelle alerte a été créée',
      topic: 'alerts',
      topicId: '6638a710dd18a1e42e5394b8',
      viewed: false,
      __v: 0,
      _id: '6638a710dd18a1e42e5394bb'
    }
  ]
  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(moodUrl, { mood: 0 })
    fetchMock.get(sharedNotifUrl, notif)
    fetchMock.post(moodUrl, {})
  })

  afterEach(() => {
    fetchMock.restore()
    sessionStorage.removeItem('role')
  })

  it('renders as an admin', async () => {
    sessionStorage.setItem('role', 'admin')

    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Sidebar />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
  })

  it('renders as a school admin', async () => {
    sessionStorage.setItem('role', 'administration')

    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Sidebar />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('sidebar-expander'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('expanded')).toBeInTheDocument()
      expect(screen.queryByTestId('collapsed')).toBe(null)
    })
  })

  it('renders as a teacher', async () => {
    sessionStorage.setItem('role', 'teacher')

    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Sidebar />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('sidebar-expander'))
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('sidebar-collapser'))
    })
  })

  it('renders as a student', async () => {
    sessionStorage.setItem('role', 'student')
    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Sidebar />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('sidebar-expander'))
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('mood-0'))
    })
  })

  // it('disconnects on post mood', async () => {
  //   sessionStorage.setItem('role', 'student')
  //   fetchMock.post(moodUrl, 401)

  //   await act(() => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <Sidebar />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })

  //   await act(() => {
  //     fireEvent.click(screen.getByTestId('sidebar-expander'))
  //   })

  //   await act(() => {
  //     fireEvent.click(screen.getByTestId('mood-1'))
  //   })

  //   await waitFor(() => {
  //     expect(disconnect).toHaveBeenCalled();
  //   });
  // })

  // it('disconnects on get mood url', async () => {
  //   sessionStorage.setItem('role', 'student')
  //   fetchMock.get(moodUrl, 401)

  //   await act(() => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <Sidebar />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })

  //   await waitFor(() => {
  //     expect(disconnect).toHaveBeenCalled();
  //   });
  // })

  // it('disconnects on get notifs', async () => {
  //   sessionStorage.setItem('role', 'student')
  //   fetchMock.get(sharedNotifUrl, 401)

  //   await act(() => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <Sidebar />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })

  //   await waitFor(() => {
  //     expect(disconnect).toHaveBeenCalled();
  //   });
  // })
})
