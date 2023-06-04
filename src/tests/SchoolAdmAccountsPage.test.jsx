import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAccountsTable from '../Components/Accounts/SchoolAdm/SchoolAccountsTable'

describe('SchoolAdmAccountPage', () => {
  it('renders the table', () => {
    render(<SchoolAccountsTable />)
    // const table = screen.getByRole('table')
    const table = screen.getByText('School accounts table')
    expect(table).toBeInTheDocument()
  })
})
