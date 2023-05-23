import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdmAccountsTable from '../Components/Accounts/Adm/AdmAccountsTable'

describe('AdmAccountsTable', () => {
  it('renders the table', () => {
    render(<AdmAccountsTable />)
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
  })

  test('renders table headers correctly', async () => {
    render(<AdmAccountsTable />)
    const tableHeaders = await screen.findAllByRole('columnheader')
    expect(tableHeaders[0]).toHaveTextContent('Prénom')
    expect(tableHeaders[1]).toHaveTextContent('Nom')
    expect(tableHeaders[2]).toHaveTextContent('Email')
  })

  test('renders account list correctly', async () => {
    const mockAccountList = [
      {
        firstName: 'Harry',
        lastName: 'Dresden',
        email: 'harry.dresden@epitech.eu'
      },
      {
        firstName: 'John',
        lastName: 'Wick',
        email: 'john.wick@epitech.eu'
      }
    ]
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockAccountList),
      status: 200,
      statusText: 'OK'
    })
    await act(async () => {
      render(<AdmAccountsTable />)
    })
    const accountRows = await screen.findAllByRole('row')
    expect(accountRows).toHaveLength(3) // header row + 2 data rows
    expect(screen.getByText('Harry')).toBeInTheDocument()
    expect(screen.getByText('Dresden')).toBeInTheDocument()
    expect(screen.getByText('harry.dresden@epitech.eu')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Wick')).toBeInTheDocument()
    expect(screen.getByText('john.wick@epitech.eu')).toBeInTheDocument()
  })
})
