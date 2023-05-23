import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAdmHomePage from '../Users/SchoolAdmin/SchoolAdmHomePage'

describe('SchoolAdmHomePage', () => {
  test('renders the LastAlerts component', () => {
    render(<SchoolAdmHomePage />)
    const lastAlertsTitle = screen.getByText('Mes Dernières Alertes')
    expect(lastAlertsTitle).toBeInTheDocument()
  })

  test('renders the GraphSpace component', () => {
    render(<SchoolAdmHomePage />)
    const lastAlertsTitle = screen.getByText("Evolution semestrielle de l'humeur de mon établissement")
    expect(lastAlertsTitle).toBeInTheDocument()
  })

  test('renders the QuestSpace component', () => {
    render(<SchoolAdmHomePage />)
    const lastAlertsTitle = screen.getByText('Mes Questionnaires')
    expect(lastAlertsTitle).toBeInTheDocument()
  })
})
