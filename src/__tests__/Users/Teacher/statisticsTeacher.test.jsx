import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import TeacherStatPage from '../../../Users/Teacher/statisticsTeacher'
import fetchMock from 'jest-fetch-mock'
import { disconnect } from '../../../functions/disconnect'
import { MemoryRouter } from 'react-router-dom'

jest.mock('chart.js/auto', () => {
  return {
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
  }
})

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

beforeEach(() => {
  fetchMock.resetMocks()
})

describe('TeacherStatPage', () => {
  test('renders correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <TeacherStatPage />
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Mes statistiques')).toBeInTheDocument()
      expect(screen.getByLabelText('Sélectionner une date:')).toBeInTheDocument()
    })
  })

  test('fetches and displays mood data correctly', async () => {
    const mockMoodData = {
      '2024-01-01': 3,
      '2024-01-02': 2,
      averagePercentage: 80
    }
    fetchMock.mockResponseOnce(JSON.stringify(mockMoodData))

    await act(async () => {
      render(
        <MemoryRouter>
          <TeacherStatPage />
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Vous êtes 80% plus heureux cette semaine que la semaine précédente')).toBeInTheDocument()
    })
  })

  test('handles date change', async () => {
    const mockMoodData = {
      '2024-01-01': 3,
      '2024-01-02': 2,
      averagePercentage: 80
    }
    fetchMock.mockResponseOnce(JSON.stringify(mockMoodData))

    await act(async () => {
      render(
        <MemoryRouter>
          <TeacherStatPage />
        </MemoryRouter>
      )
    })

    const dateInput = screen.getByLabelText('Sélectionner une date:')
    fireEvent.change(dateInput, { target: { value: '2024-02-01' } })

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
  })

  test('handles filter change', async () => {
    const mockMoodData = {
      '2024-01-01': 3,
      '2024-01-02': 2,
      averagePercentage: 80
    }
    fetchMock.mockResponseOnce(JSON.stringify(mockMoodData))

    await act(async () => {
      render(
        <MemoryRouter>
          <TeacherStatPage />
        </MemoryRouter>
      )
    })

    const moisFilterButton = screen.getByText('Mois')
    fireEvent.click(moisFilterButton)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
  })

  test('disconnects on 401 error', async () => {
    fetchMock.mockResponseOnce('', { status: 401 })


    await act(async () => {
      render(
        <MemoryRouter>
          <TeacherStatPage />
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalledTimes(1)
    })
  })
})
