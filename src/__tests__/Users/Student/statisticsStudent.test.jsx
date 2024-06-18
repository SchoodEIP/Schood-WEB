import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StudentStatPage from '../../../Users/Student/statisticsStudent'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'
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

describe('StudentStatPage', () => {
  const moodUrl = process.env.REACT_APP_BACKEND_URL + '/student/statistics/dailyMoods'

  const mockMoodData = [
    { date: '2024-01-01', moods: [2, 4], average: 3 },
    { date: '2024-01-03', moods: [2, 4], average: 3 },
    { averagePercentage: 80 }
  ]

  beforeEach(() => {
    fetchMock.config.overwriteRoutes = true
    fetchMock.post(moodUrl, mockMoodData)
    sessionStorage.setItem('role', 'student')
    localStorage.setItem('role', 'student')
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
            <StudentStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(async () => {
      expect(screen.getByText('Mes statistiques')).toBeInTheDocument()
      expect(screen.getByLabelText('Sélectionner une date:')).toBeInTheDocument()
    })
  })

  test('fetches and displays mood data correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <StudentStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByTestId('average-happiness-percentage').textContent).toBe('Vous êtes 80% plus heureux cette semaine que la semaine précédente')
    })
  })

  test('handles date change', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <StudentStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const dateInput = screen.getByLabelText('Sélectionner une date:')
    await act(() => {
      fireEvent.change(dateInput, { target: { value: '2024-02-01' } })
    })
  })

  test('handles filter change', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <StudentStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const moisFilterButton = screen.getByText('Mois')
    await act(() => {
      fireEvent.click(moisFilterButton)
    })
  })

  test('disconnects on 401 error', async () => {
    fetchMock.post(moodUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <StudentStatPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalledTimes(1)
    })
  })
})
