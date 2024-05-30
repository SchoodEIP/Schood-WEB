import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import TeacherStatPage from '../../../Users/Teacher/statisticsTeacher'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'
import { MemoryRouter } from 'react-router-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import '@testing-library/jest-dom'

jest.mock('chart.js', () => ({
  Chart: jest.fn().mockImplementation(() => {
    return {
      destroy: jest.fn(),
      update: jest.fn(),
      data: {
        datasets: [{}]
      },
      options: {
        scales: {
          x: {
            labels: []
          }
        }
      }
    }
  })
}))


jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('TeacherStatPage', () => {
  const moodUrl = process.env.REACT_APP_BACKEND_URL + '/shared/statistics/dailyMoods'
  const answersUrl = process.env.REACT_APP_BACKEND_URL + '/shared/statistics/answers'
  const classesUrl = process.env.REACT_APP_BACKEND_URL + '/shared/classes'

  const mockMoodData = {
    '2024-05-29': {
      average: 2,
      moods: [3, 1]
    },
    '2024-05-30': {
      average: 1,
      moods: [1, 1]
    },
    averagePercentage: 80
  }

  const mockAnswerData = {
    '2024-05-30': 60
  }

  const mockClassesData = [{ _id: '64f72b4d06c0818813902612', name: '200' }]

  beforeEach(() => {
    fetchMock.config.overwriteRoutes = true
    fetchMock.post(moodUrl, mockMoodData)
    fetchMock.post(answersUrl, mockAnswerData)
    fetchMock.get(classesUrl, mockClassesData)
    sessionStorage.setItem('role', 'teacher')
    localStorage.setItem('role', 'teacher')
  })

  afterEach(() => {
    jest.clearAllMocks()
    fetchMock.restore()
    sessionStorage.removeItem('role')
    localStorage.removeItem('role')
  })


  test('renders correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <TeacherStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(async() => {
      expect(screen.getByText('Mes statistiques')).toBeInTheDocument()
      expect(screen.getByLabelText('Sélectionner une date:')).toBeInTheDocument()
    })
  })

  test('fetches and displays mood data correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <TeacherStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Vous êtes 80% plus heureux cette semaine que la semaine précédente')).toBeInTheDocument()
    })
  })

  test('handles date change', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <TeacherStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const dateInput = screen.getByLabelText('Sélectionner une date:')
    fireEvent.change(dateInput, { target: { value: '2024-02-01' } })

  })

  test('handles filter change', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <TeacherStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const moisFilterButton = screen.getByText('Mois')
    fireEvent.click(moisFilterButton)

  })

  test('disconnects on 401 error mood url', async () => {
    fetchMock.post(moodUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <TeacherStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalledTimes(1)
    })
  })

  test('disconnects on 401 error answers url', async () => {
    fetchMock.get(answersUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <TeacherStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalledTimes(1)
    })
  })

  test('disconnects on 401 error classes url', async () => {
    fetchMock.post(classesUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <TeacherStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalledTimes(1)
    })
  })
})
