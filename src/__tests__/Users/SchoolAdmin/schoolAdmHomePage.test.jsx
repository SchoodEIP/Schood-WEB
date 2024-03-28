import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAdmHomePage from '../../../Users/SchoolAdmin/schoolAdmHomePage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('SchoolAdmHomePage', () => {
  test('renders the LastAlerts component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAdmHomePage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const lastAlertsTitle = screen.getByText('Mes Dernières Alertes')
    expect(lastAlertsTitle).toBeInTheDocument()
  })

  test('renders the GraphSpace component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAdmHomePage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const lastAlertsTitle = screen.getByText("Evolution semestrielle de l'humeur de mon établissement")
    expect(lastAlertsTitle).toBeInTheDocument()
  })

  test('renders the QuestSpace component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAdmHomePage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const lastAlertsTitle = screen.getByText('Mes Questionnaires')
    expect(lastAlertsTitle).toBeInTheDocument()
  })
})
