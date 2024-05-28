import React from 'react'
import { QuestSpace } from '../../../Components/Questionnaire/questSpace.jsx'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('QuestSpace Component', () => {
  const statusLastTwo = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/statusLastTwo/`

  // function getFormDates () {
  //   const today = new Date()
  //   const dayOfWeek = today.getDay() // Sunday is 0, Monday is 1, ..., Saturday is 6
  //   const diffThisWeekMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust when today is Sunday
  //   const diffLastWeekMonday = diffThisWeekMonday - 7 // Subtract 7 days to get last week's Monday
  //   const thisWeekMonday = new Date(today.setDate(diffThisWeekMonday))
  //   const lastWeekMonday = new Date(today.setDate(diffLastWeekMonday))

  //   // Set the time to 00:00:00.000 UTC for both Monday dates
  //   thisWeekMonday.setUTCHours(0, 0, 0, 0)
  //   lastWeekMonday.setUTCHours(0, 0, 0, 0)

  //   // Calculate this week's and last week's Sunday dates
  //   const thisWeekSunday = new Date(thisWeekMonday)
  //   const lastWeekSunday = new Date(lastWeekMonday)

  //   // Add 6 days to get to Sunday and set the time to 23:59:59.000 UTC
  //   thisWeekSunday.setDate(thisWeekSunday.getDate() + 6)
  //   thisWeekSunday.setUTCHours(23, 59, 59, 0)

  //   lastWeekSunday.setDate(lastWeekSunday.getDate() + 6)
  //   lastWeekSunday.setUTCHours(23, 59, 59, 0)

  //   return [[lastWeekMonday, lastWeekSunday], [thisWeekMonday, thisWeekSunday]]
  // }

  // const [[lastWeekMonday, lastWeekSunday], [thisWeekMonday, thisWeekSunday]] = getFormDates()

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(statusLastTwo, {
      q1: {
        completion: 100,
        id: '1',
        title: 'Premier'
      },
      q2: {
        completion: 50,
        id: '2',
        title: 'Deuxieme'
      }
    })
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('shows the component QuestSpace', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <QuestSpace />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const questSpaceElement = screen.getByTestId('quest-space') // Utilisation de getByTestId
    expect(questSpaceElement).toBeInTheDocument()
  })

  test('checks disconnect through statusLastTwo url', async () => {
    fetchMock.get(statusLastTwo, 401)

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <QuestSpace />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('shows the title of Mes Questionnaires', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <QuestSpace />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const titleElement = screen.getByText('Mes Questionnaires')
    expect(titleElement).toBeInTheDocument()
  })

  it('tests catch error', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <QuestSpace />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const titleElement = screen.getByText('Mes Questionnaires')
    expect(titleElement).toBeInTheDocument()
  })

  it('moves to current form', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <QuestSpace />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const titleElement = screen.getByText('Premier - 100%')
    expect(titleElement).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(titleElement)
    })
  })

  it('moves to previous form', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <QuestSpace />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const titleElement = screen.getByText('Deuxieme - 50%')
    expect(titleElement).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(titleElement)
    })
  })

  it('checks empty forms', async () => {
    fetchMock.get(statusLastTwo, { q1: null, q2: null })
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <QuestSpace />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const titleElement = screen.getByText('Mes Questionnaires')
    expect(titleElement).toBeInTheDocument()
    expect(screen.getByText("Aucun questionnaire n'est disponible")).toBeInTheDocument()
  })

  it('goes to new form', async () => {
    fetchMock.get(statusLastTwo, {
      q1: {
        completion: 100,
        id: '',
        title: 'Premier'
      },
      q2: {
        completion: 0,
        id: '1',
        title: 'Deuxieme'
      }
    })

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <QuestSpace />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const titleElement = screen.getByText('Deuxieme - 0%')
    expect(titleElement).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(titleElement)
    })
  })
})
