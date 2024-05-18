import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAccountsTable from '../../../../Components/Accounts/SchoolAdm/schoolAccountsTable'
import { WebsocketProvider } from '../../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../../functions/sharedFunctions'

jest.mock('../../../../functions/sharedFunctions', () => ({
  disconnect: jest.fn(),
}));

describe('SchoolAdmAccountsTable', () => {
  let container = null
  const url = process.env.REACT_APP_BACKEND_URL

  const mockAccountList = [
    {
      firstname: 'Harry',
      lastname: 'Dresden',
      email: 'harry.dresden@epitech.eu',
      role: {
        _id: '0',
        name: 'student',
        levelOfAccess: '0'
      },
      classes: [{
        _id: 'id3',
        name: '202'
      }]
    },
    {
      firstname: 'John',
      lastname: 'Wick',
      email: 'john.wick@epitech.eu',
      role: {
        _id: '1',
        name: 'teacher',
        levelOfAccess: '1'
      },
      title: 'Mathematique',
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


  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(url + '/user/all', mockAccountList)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    fetchMock.restore()
  })

  it('renders the table', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const table = screen.getAllByRole('table')
    expect(table[0]).toBeInTheDocument()
    expect(table[1]).toBeInTheDocument()
  })

  test('renders table headers correctly', async () => {
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
    expect(tableHeaders[0]).toHaveTextContent('')
    expect(tableHeaders[1]).toHaveTextContent('Prénom')
    expect(tableHeaders[2]).toHaveTextContent('Nom')
    expect(tableHeaders[3]).toHaveTextContent('Email')
  })

  test('renders account list correctly', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const accountRows = screen.findAllByRole('row')

    await waitFor(async() => {
      expect(await accountRows).toHaveLength(4) // header row + 2 data rows
      expect(screen.getByText('Harry')).toBeInTheDocument()
      expect(screen.getByText('200, 201')).toBeInTheDocument()
      expect(screen.getByText('202')).toBeInTheDocument()
    })
  })


  test('checks disconnect through user url', async () => {
    fetchMock.get(url + '/user/all', 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })
})
