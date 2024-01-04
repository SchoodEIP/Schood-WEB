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
  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(previousUrl, { body: { status: 'not_started' } })
    fetchMock.get(currentUrl, { body: { status: 'in_progress' } })
    fetchMock.get(dailyMood, { moodStatus: true, mood: "Heureux"})
    fetchMock.post(dailyMood, { })
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
