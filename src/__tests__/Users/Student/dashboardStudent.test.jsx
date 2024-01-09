import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act } from '@testing-library/react'
import StudentHomePage from '../../../Users/Student/dashboardStudent'
import { MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('Dashboard Student component', () => {
  const previousUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/previous`
  const currentUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/current`
  const dailyMood = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/dailyMood`
  const lastAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/`

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
    fetchMock.get(previousUrl, { body: { status: 'not_started' } })
    fetchMock.get(currentUrl, { body: { status: 'in_progress' } })
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
        <MemoryRouter>
          <StudentHomePage />
        </MemoryRouter>
      )
    })
    expect(screen.getByText('Mes Dernières Alertes')).toBeInTheDocument()
    expect(screen.getByText("Evolution semestrielle de l'humeur de mon établissement")).toBeInTheDocument()
    expect(screen.getByText('Mes Questionnaires')).toBeInTheDocument()
  })
})
