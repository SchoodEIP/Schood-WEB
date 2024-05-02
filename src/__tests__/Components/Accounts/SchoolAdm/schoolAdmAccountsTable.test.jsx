import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAccountsTable from '../../../../Components/Accounts/SchoolAdm/schoolAccountsTable'
import { WebsocketProvider } from '../../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('SchoolSchoolAccountsTable', () => {
  it('renders the table', async () => {
    const mockAccountList = [
      {
        firstname: 'Harry',
        lastname: 'Dresden',
        email: 'harry.dresden@epitech.eu',
        role: 'student',
        classes: [
          {
            _id: 'id1',
            name: '200'
          }
        ]
      },
      {
        firstname: 'John',
        lastname: 'Wick',
        email: 'john.wick@epitech.eu',
        role: 'teacher',
        classes: [
          {
            _id: 'id1',
            name: '200'
          },
          {
            _id: 'id2',
            name: '201'
          }
        ]
      }
    ]
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockAccountList),
      status: 200,
      statusText: 'OK'
    })
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
  })

  test('renders table headers correctly', async () => {
    const mockAccountList = [
      {
        firstname: 'Harry',
        lastname: 'Dresden',
        email: 'harry.dresden@epitech.eu',
        role: 'student',
        classes: [{
          _id: 'id1',
          name: '200'
        }]
      },
      {
        firstname: 'John',
        lastname: 'Wick',
        email: 'john.wick@epitech.eu',
        role: 'teacher',
        classes: [
          {
            _id: 'id1',
            name: '200'
          },
          {
            _id: 'id2',
            name: '201'
          }
        ]
      }
    ]
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockAccountList),
      status: 200,
      statusText: 'OK'
    })
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const tableHeaders = await screen.findAllByRole('columnheader')
    expect(tableHeaders[0]).toHaveTextContent('Prénom')
    expect(tableHeaders[1]).toHaveTextContent('Nom')
    expect(tableHeaders[2]).toHaveTextContent('Email')
  })

  test('renders account list incorrectly', async () => {
    const mockAccountList = [
      {
        firstname: 'Harry',
        lastname: 'Dresden',
        email: 'harry.dresden@epitech.eu',
        role: 'student',
        classes: [{
          _id: 'id3',
          name: '202'
        }]
      },
      {
        firstname: 'John',
        lastname: 'Wick',
        email: 'john.wick@epitech.eu',
        role: 'teacher',
        classes: [
          {
            _id: 'id1',
            name: '200'
          },
          {
            _id: 'id2',
            name: '201'
          }
        ]
      }
    ]
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockAccountList),
      status: 200,
      statusText: 'OK'
    })
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const accountRows = await screen.findAllByRole('row')
    expect(accountRows).toHaveLength(3) // header row + 2 data rows
    expect(screen.getByText('Harry')).toBeInTheDocument()
    expect(screen.getByText('200, 201')).toBeInTheDocument()
    expect(screen.getByText('202')).toBeInTheDocument()
  })
})
