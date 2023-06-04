import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAdmHomePage from '../Users/SchoolAdmin/SchoolAdmHomePage'
import { BrowserRouter } from 'react-router-dom'

describe('SchoolAdmHomePage', () => {
  test('renders the LastAlerts component', () => {
    render(
      <BrowserRouter>
        <SchoolAdmHomePage />
      </BrowserRouter>
    )
    const lastAlertsTitle = screen.getByText('Mes Dernières Alertes')
    expect(lastAlertsTitle).toBeInTheDocument()
  })

  test('renders the GraphSpace component', () => {
    render(
      <BrowserRouter>
        <SchoolAdmHomePage />
      </BrowserRouter>
    )
    const lastAlertsTitle = screen.getByText("Evolution semestrielle de l'humeur de mon établissement")
    expect(lastAlertsTitle).toBeInTheDocument()
  })

  test('renders the QuestSpace component', () => {
    render(
      <BrowserRouter>
        <SchoolAdmHomePage />
      </BrowserRouter>
    )
    const lastAlertsTitle = screen.getByText('Mes Questionnaires')
    expect(lastAlertsTitle).toBeInTheDocument()
  })
})
