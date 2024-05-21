import React from 'react'
import { render, act, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import StudentStatPage from '../../../Users/Student/statisticsStudent'
import { WebsocketProvider } from '../../../contexts/websocket'
import { MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn(),
}));

describe('StudentStatPage Component', () => {
  const dailyMoodsUrl = process.env.REACT_APP_BACKEND_URL + '/student/statistics/dailyMoods'

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.post(dailyMoodsUrl, {})
    sessionStorage.setItem('role', 'student')
  })

  afterEach(() => {
    fetchMock.restore()
  })

  // it('renders without crashing', async () => {
  //   await act(async () => {
  //     render(
  //       <MemoryRouter >
  //         <WebsocketProvider>
  //           <StudentStatPage/>
  //         </WebsocketProvider>
  //       </MemoryRouter>
  //     )
  //   })
  //   expect(screen.getByText('Mes statistiques')).toBeInTheDocument()

  // })

  // test('checks disconnect through post daily moods url', async () => {
  //   fetchMock.post(dailyMoodsUrl, 401)

  //   await act(async () => {
  //     render(
  //       <MemoryRouter >
  //         <WebsocketProvider>
  //           <StudentStatPage/>
  //         </WebsocketProvider>
  //       </MemoryRouter>
  //     )
  //   })

  //   await waitFor(() => {
  //     expect(disconnect).toHaveBeenCalled();
  //   });
  // })

})
