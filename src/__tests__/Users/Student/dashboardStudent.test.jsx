import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act } from '@testing-library/react'
import StudentHomePage from '../../../Users/Student/dashboardStudent'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('Dashboard Student component', () => {
  const statusLastTwo = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/statusLastTwo/`
  const questionnaires = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/`
  const dailyMood = `${process.env.REACT_APP_BACKEND_URL}/student/dailyMood`
  const lastAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/`

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
      fromDate: '2024-02-19T00:00:00.000Z',
      title: 'Questionnaire Français',
      toDate: '2024-02-25T00:00:00.000Z',
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
      fromDate: '2024-02-26T00:00:00.000Z',
      title: 'Questionnaire Mathématique',
      toDate: '2024-03-03T00:00:00.000Z',
      _id: 'id2'
    }
  ]

  const statusTwoResult = {
    q1: 100,
    q2: 50
  }

  const alertList = [
    {
      title: 'Première Alerte',
      message: 'Ceci est la première alerte',
      classes: [],
      role: [],
      createdAt: '2023',
      createdBy: '0921',
      file: ''
    },
    {
      title: 'Mr Math',
      message: 'Des contacts pour le soutien scolaire se trouvent dans la partie aide',
      classes: [],
      role: [],
      createdAt: '2023',
      createdBy: '0921',
      file: 'qpfnilguiqdv,qnbjafimgozpemq,lkdiofs'
    }
  ]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(statusLastTwo, statusTwoResult)
    fetchMock.get(questionnaires, questionnairesResult)
    fetchMock.get(dailyMood, { moodStatus: true, mood: 1 })
    fetchMock.post(dailyMood, { })
    fetchMock.get(lastAlert, { body: alertList })
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('should render the homepage', async () => {
    await act(async () => {
      render(
        render(
          <BrowserRouter>
            <WebsocketProvider>
              <StudentHomePage />
            </WebsocketProvider>
          </BrowserRouter>
        )
      )
    })
    expect(screen.getByText('Mes Dernières Alertes')).toBeInTheDocument()
    expect(screen.getByText("Evolution semestrielle de l'humeur de mon établissement")).toBeInTheDocument()
    expect(screen.getByText('Mes Questionnaires')).toBeInTheDocument()
  })
})
