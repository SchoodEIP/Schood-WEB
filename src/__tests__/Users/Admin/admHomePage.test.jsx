import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdmHomePage from '../../../Users/Admin/admHomePage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('AdmHomePage', () => {
  test('renders the LastAlerts component', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <AdmHomePage />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const lastAlertsTitle = screen.getByText('Mes Dernières Alertes')
    expect(lastAlertsTitle).toBeInTheDocument()
  })
})
