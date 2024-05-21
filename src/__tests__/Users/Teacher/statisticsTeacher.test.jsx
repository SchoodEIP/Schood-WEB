// Import necessary libraries and components
import TeacherStatPage from '../../../Users/Teacher/statisticsTeacher'
import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { WebsocketProvider } from '../../../contexts/websocket'
import { disconnect } from '../../../functions/disconnect'
import { createCanvas } from 'canvas';

// Mock the HTMLCanvasElement.prototype.getContext method
HTMLCanvasElement.prototype.getContext = function (type) {
  if (type === '2d') {
    return createCanvas(200, 200).getContext(type);
  }
  return null;
};

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn(),
}));

describe('TeacherStatPage Component', () => {
  const mockMood = {
      '2024-02-24': {
        average: 3,
        moods: ['3']
      },
      averagePercentage: 100
    }

  const mockClasses = [
    {
      name: '200',
      _id: '1',
      facility: '0'
    }
  ]

  const backendUrl = process.env.REACT_APP_BACKEND_URL
  const classesUrl = process.env.REACT_APP_BACKEND_URL + '/shared/classes'
  const moodUrl = process.env.REACT_APP_BACKEND_URL + '/shared/statistics/dailyMoods'
  const answersUrl = process.env.REACT_APP_BACKEND_URL + '/shared/statistics/answers'

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(classesUrl, mockClasses)
    fetchMock.post(moodUrl, mockMood)
    fetchMock.post(answersUrl, [{}])
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('renders statistics', async () => {

    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <TeacherStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    expect(screen.getByText('Mes statistiques')).toBeInTheDocument()

  })

  // it('handles error when fetching student moods', async () => {
  //   const studentId = '2'

  //   fetchMock.get(`${backendUrl}/teacher/dailyMood/${studentId}`, 500)

  //   await act(async () => {
  //     render(
  //       <MemoryRouter initialEntries={[`/teacher/dailyMood/${studentId}`]}>
  //         <WebsocketProvider>
  //           <Routes>
  //             <Route path='/teacher/dailyMood/:id' element={<TeacherStatPage />} />
  //           </Routes>
  //         </WebsocketProvider>
  //       </MemoryRouter>
  //     )
  //   })

  //   expect(screen.getByText('Erreur lors de la récupération des statistiques')).toBeInTheDocument()
  // })

  // it('handles disconnect when getting classes', async () => {
  //   fetchMock.get(`${backendUrl}/shared/classes/`, 401)

  //   await act(async () => {
  //     render(
  //       <MemoryRouter>
  //         <WebsocketProvider>
  //           <TeacherStatPage />
  //         </WebsocketProvider>
  //       </MemoryRouter>
  //     )
  //   })

  //   await waitFor(() => {
  //     expect(disconnect).toHaveBeenCalled();
  //   });
  // })

  // it('displays "Aucunes statistiques disponible." when no moods are available', async () => {
  //   const studentId = '3'

  //   fetchMock.get(`${backendUrl}/teacher/dailyMood/${studentId}`, {
  //     body: [],
  //     headers: { 'content-type': 'application/json' }
  //   })

  //   await act(async () => {
  //     render(
  //       <MemoryRouter initialEntries={[`/teacher/dailyMood/${studentId}`]}>
  //         <WebsocketProvider>
  //           <Routes>
  //             <Route path='/teacher/dailyMood/:id' element={<TeacherStatPage />} />
  //           </Routes>
  //         </WebsocketProvider>
  //       </MemoryRouter>
  //     )
  //   })
  // })
})
