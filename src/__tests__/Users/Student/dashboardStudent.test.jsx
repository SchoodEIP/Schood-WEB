import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act } from '@testing-library/react'
import StudentHomePage from '../../../Users/Student/dashboardStudent'
import fetchMock from 'fetch-mock'
import { MemoryRouter } from 'react-router-dom';

describe('Dashboard Student component', () => {
  const previousUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/previous`
  const currentUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/current`

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(previousUrl, { body: { status: 'not_started' } })
    fetchMock.get(currentUrl, { body: { status: 'in_progress' } })
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
