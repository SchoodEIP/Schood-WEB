import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdmHomePage from '../../../Users/Admin/admHomePage'
import { BrowserRouter } from 'react-router-dom'

describe('AdmHomePage', () => {
  test('renders the LastAlerts component', () => {
    render(
      <BrowserRouter>
        <AdmHomePage />
      </BrowserRouter>
    )
    const lastAlertsTitle = screen.getByText('Mes Dernières Alertes')
    expect(lastAlertsTitle).toBeInTheDocument()
  })
})
