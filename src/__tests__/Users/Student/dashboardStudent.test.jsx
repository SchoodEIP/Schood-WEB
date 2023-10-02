import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import StudentHomePage from '../../../Users/Student/dashboardStudent'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('Dashboard Student component', () => {
  const previousUrl = 'http://localhost:8080/shared/questionnaire/previous'
  const currentUrl = 'http://localhost:8080/shared/questionnaire/current'

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
        <BrowserRouter>
          <StudentHomePage />
        </BrowserRouter>
      )
    })
    expect(screen.getByText('Mes Dernières Alertes')).toBeInTheDocument()
    expect(screen.getByText("Evolution semestrielle de l'humeur de mon établissement")).toBeInTheDocument()
    expect(screen.getByText('Mes Questionnaires')).toBeInTheDocument()
  })
})
