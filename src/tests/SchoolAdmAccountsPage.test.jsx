import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAccountsTable from '../Components/Accounts/SchoolAdm/SchoolAccountsTable'
import {BrowserRouter} from 'react-router-dom'
describe('SchoolAdmAccountPage', () => {
  it('renders the table', () => {
    render(
    <BrowserRouter>
      <SchoolAccountsTable />
    </BrowserRouter>
    )
    // const table = screen.getByRole('table')
    const table = screen.getByText('School accounts table')
    expect(table).toBeInTheDocument()
  })
})
