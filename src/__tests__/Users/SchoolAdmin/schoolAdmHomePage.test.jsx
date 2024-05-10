import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAdmHomePage from '../../../Users/SchoolAdmin/schoolAdmHomePage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('SchoolAdmHomePage', () => {
  sessionStorage.setItem('role', 'administration')

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
    const lastAlertsTitle = screen.getByText("Evolution de l'humeur de mon établissement")
    expect(lastAlertsTitle).toBeInTheDocument()
  })
})
