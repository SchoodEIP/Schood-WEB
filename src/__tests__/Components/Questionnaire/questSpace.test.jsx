import React from 'react'
import { QuestSpace } from '../../../Components/Questionnaire/questSpace.jsx'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('QuestSpace Component', () => {
  const statusLastTwo = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/statusLastTwo/`
  const questionnaires = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/`

  function getFormDates () {
    const today = new Date()
    const dayOfWeek = today.getDay() // Sunday is 0, Monday is 1, ..., Saturday is 6
    const diffThisWeekMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust when today is Sunday
    const diffLastWeekMonday = diffThisWeekMonday - 7 // Subtract 7 days to get last week's Monday
    const thisWeekMonday = new Date(today.setDate(diffThisWeekMonday))
    const lastWeekMonday = new Date(today.setDate(diffLastWeekMonday))

    // Set the time to 00:00:00.000 UTC for both Monday dates
    thisWeekMonday.setUTCHours(0, 0, 0, 0)
    lastWeekMonday.setUTCHours(0, 0, 0, 0)

    // Calculate this week's and last week's Sunday dates
    const thisWeekSunday = new Date(thisWeekMonday)
    const lastWeekSunday = new Date(lastWeekMonday)

    // Add 6 days to get to Sunday and set the time to 23:59:59.000 UTC
    thisWeekSunday.setDate(thisWeekSunday.getDate() + 6)
    thisWeekSunday.setUTCHours(23, 59, 59, 0)

    lastWeekSunday.setDate(lastWeekSunday.getDate() + 6)
    lastWeekSunday.setUTCHours(23, 59, 59, 0)

    return [[lastWeekMonday, lastWeekSunday], [thisWeekMonday, thisWeekSunday]]
  }

  const [[lastWeekMonday, lastWeekSunday], [thisWeekMonday, thisWeekSunday]] = getFormDates()

  const questionnairesResult = [
    {
      classes: [
        {
          name: '200',
          __v: 0,
          _id: '65e0e4477c0cc03bd4999ebd'
        },
        {
          name: '201',
          __v: 0,
          _id: '65e0e4477c0cc03bd4999ebf'
        }
      ],
      facility: '65e0e4477c0cc03bd4999eb7',
      fromDate: lastWeekMonday.toISOString(),
      title: 'Questionnaire Français',
      toDate: lastWeekSunday.toISOString(),
      _id: 'id1'
    },
    {
      classes: [
        {
          name: '200',
          __v: 0,
          _id: '65e0e4477c0cc03bd4999ebd'
        }
      ],
      facility: '65e0e4477c0cc03bd4999eb7',
      fromDate: thisWeekMonday.toISOString(),
      title: 'Questionnaire Mathématique',
      toDate: thisWeekSunday.toISOString(),
      _id: 'id2'
    }
  ]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(statusLastTwo, { q1: 100, q2: 50 })
    fetchMock.get(questionnaires, questionnairesResult)
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

  it('goes to the form', async () => {
    const newQuestionnairesResult = [
      {
        classes: [
          {
            name: '200',
            __v: 0,
            _id: '65e0e4477c0cc03bd4999ebd'
          }
        ],
        facility: '65e0e4477c0cc03bd4999eb7',
        fromDate: thisWeekMonday.toISOString(),
        title: 'Questionnaire Mathématique',
        toDate: thisWeekSunday.toISOString(),
        _id: 'id2'
      }
    ]
    fetchMock.get(statusLastTwo, { q1: 100, q2: 0 })
    fetchMock.get(questionnaires, newQuestionnairesResult)
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
      const previousformStatus = screen.queryByText("Il n'y a pas de questionnaire précédent pour le moment.")
      expect(previousformStatus).toBeInTheDocument()
    })

    await waitFor(() => {
      const currentformStatus = screen.queryByText('Ce questionnaire a été complété.')
      expect(currentformStatus).toBeInTheDocument()
    })
  })
})
