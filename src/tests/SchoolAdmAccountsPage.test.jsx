import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import SchoolAdmAccountsPage from '../Users/SchoolAdmin/SchoolAdmAccountsPage'
describe('SchoolAdmAccountPage', () => {
  it('renders the table', () => {
    render(
      <BrowserRouter>
        <SchoolAdmAccountsPage />
      </BrowserRouter>
    )

    const table = screen.getByText('School accounts table')
    expect(table).toBeInTheDocument()
  })
})
