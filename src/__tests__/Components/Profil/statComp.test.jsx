import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import fetchMock from 'fetch-mock'
import { WebsocketProvider } from '../../../contexts/websocket'
import { MemoryRouter } from 'react-router-dom'
import { disconnect } from '../../../functions/disconnect'
import StatComp from '../../../Components/Profil/statComp'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

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

describe('StatComp', () => {
  const classesUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/classes`
  const moodUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/statistics/dailyMoods/?id=123`

  const moods = [
    { date: '2024-01-01', moods: [2, 4], average: 0 },
    { date: '2024-01-02', moods: [2, 4], average: 1 },
    { date: '2024-01-03', moods: [2, 4], average: 2 },
    { date: '2024-01-04', moods: [2, 4], average: 3 },
    { date: '2024-01-05', moods: [2, 4], average: 4 },
    { averagePercentage: 80 }
  ]
  const classes = [{ _id: '0', name: '200' }, { _id: '1', name: '200' }]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.post(moodUrl, moods)
    fetchMock.get(classesUrl, classes)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('shows title student', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <StatComp id={123} userClass={['0']} userRole='student' />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const message = await screen.getByText("Évolution de l'humeur")
    await waitFor(async () => {
      expect(message).toBeInTheDocument()
    })
  })

  it('shows title teacher', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <StatComp id={123} userClass={['0', '1']} userRole='teacher' />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const message = await screen.getByText("Évolution de l'humeur des classes")
    await waitFor(async () => {
      expect(message).toBeInTheDocument()
    })
  })

  it('changes data spread', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <StatComp id={123} userClass={['0', '1']} userRole='teacher' />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const yearBtn = await screen.getByTestId('btn-select-year')
    await act(async () => {
      fireEvent.click(yearBtn)
    })

    const semesterBtn = await screen.getByTestId('btn-select-semester')
    await act(async () => {
      fireEvent.click(semesterBtn)
    })

    const monthBtn = await screen.getByTestId('btn-select-month')
    await act(async () => {
      fireEvent.click(monthBtn)
    })

    const weekBtn = await screen.getByTestId('btn-select-week')
    await act(async () => {
      fireEvent.click(weekBtn)
    })
  })

  it('disconnects mood url', async () => {
    fetchMock.post(moodUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <StatComp id={123} userClass={['0']} userRole='student' />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(async () => {
      expect(disconnect).toBeCalled()
    })
  })

  it('disconnects classes url', async () => {
    fetchMock.get(classesUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter>
          <WebsocketProvider>
            <StatComp id={123} userClass={['0']} userRole='student' />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(async () => {
      expect(disconnect).toBeCalled()
    })
  })
})
