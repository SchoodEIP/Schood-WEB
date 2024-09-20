import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAccountsTable from '../../../../Components/Accounts/SchoolAdm/schoolAccountsTable'
import { WebsocketProvider } from '../../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../../functions/disconnect'

jest.mock('../../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('SchoolAdmAccountsTable', () => {
  let container = null
  const baseUrl = process.env.REACT_APP_BACKEND_URL + '/user/all'
  const deleteUrl0 = process.env.REACT_APP_BACKEND_URL + '/adm/deleteUser/0'
  const deleteUrl1 = process.env.REACT_APP_BACKEND_URL + '/adm/deleteUser/1'

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
      picture: 'https://res.cloudinary.com/def3ztvli/image/upload/v1716431987/d959d8e47a1e9fd2293f1b5f9c61a729_gxlcep.png',
      classes: [{
        _id: 'id3',
        name: '202'
      }],
      _id: '0'
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
      picture: 'https://res.cloudinary.com/def3ztvli/image/upload/v1716431987/d959d8e47a1e9fd2293f1b5f9c61a729_gxlcep.png',
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
      ],
      _id: '1'
    }
  ]

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.config.overwriteRoutes = true
    fetchMock.reset()
    fetchMock.get(baseUrl, mockAccountList)
    fetchMock.delete(deleteUrl0, 200)
    fetchMock.delete(deleteUrl1, 200)
    delete window.location
    window.location = { href: '' }
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

  test('checks teacher role', async () => {
    sessionStorage.setItem('role', 'teacher')
    fetchMock.get(baseUrl, 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    sessionStorage.removeItem('role')
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

    await waitFor(async () => {
      expect(await accountRows).toHaveLength(4) // header row + 2 data rows
      expect(screen.getByText('Harry')).toBeInTheDocument()
      expect(screen.getByText('200, 201')).toBeInTheDocument()
      expect(screen.getByText('202')).toBeInTheDocument()
    })
  })

  it('mocks no classes', async () => {
    const noClasses = [
      {
        firstname: 'Harry',
        lastname: 'Dresden',
        email: 'harry.dresden@epitech.eu',
        role: {
          _id: '0',
          name: 'student',
          levelOfAccess: '0'
        },
        classes: '',
        _id: '0'
      }
    ]
    fetchMock.get(baseUrl, noClasses)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <SchoolAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
  })

  it('shows user profile', async () => {
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

    await waitFor(async () => {
      expect(await accountRows).toHaveLength(4) // header row + 2 data rows
      expect(screen.getByText('Harry')).toBeInTheDocument()
      expect(screen.getByText('200, 201')).toBeInTheDocument()
      expect(screen.getByText('202')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Harry'))
    })

    await waitFor(async () => {
      expect(window.location.href).toBe('/profile/0')
    })
  })

  test('testing suspend account', async () => {
    sessionStorage.setItem('role', 'admin')
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

    await waitFor(async () => {
      expect(await accountRows).toHaveLength(4) // header row + 2 data rows
      expect(screen.getByText('Harry')).toBeInTheDocument()
      expect(screen.getByText('200, 201')).toBeInTheDocument()
      expect(screen.getByText('202')).toBeInTheDocument()
    })

    const suspendBtns = await screen.getAllByTestId('suspendBtn')

    await waitFor(async () => {
      expect(suspendBtns).toHaveLength(2)
    })

    await act(async () => {
      fireEvent.click(suspendBtns[0])
    })

    await waitFor(async () => {
      expect(screen.getByText('Suppression du Compte')).toBeInTheDocument()
    })

    const newMockAccountList = [
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
        ],
        _id: '1'
      }
    ]

    fetchMock.get(baseUrl, newMockAccountList)

    const suspendBtn = await screen.getByText('Suppression temporaire')

    await act(async () => {
      fireEvent.click(suspendBtn)
    })

    const leavePopup = await screen.getByText('Annuler')

    await act(async () => {
      fireEvent.click(leavePopup)
    })
    sessionStorage.removeItem('role')
  })

  test('testing delete account', async () => {
    sessionStorage.setItem('role', 'admin')
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

    await waitFor(async () => {
      expect(await accountRows).toHaveLength(4) // header row + 2 data rows
      expect(screen.getByText('Harry')).toBeInTheDocument()
      expect(screen.getByText('200, 201')).toBeInTheDocument()
      expect(screen.getByText('202')).toBeInTheDocument()
    })

    const suspendBtns = await screen.getAllByTestId('suspendBtn')

    await waitFor(async () => {
      expect(suspendBtns).toHaveLength(2)
    })

    await act(async () => {
      fireEvent.click(suspendBtns[1])
    })

    await waitFor(async () => {
      expect(screen.getByText('Suppression du Compte')).toBeInTheDocument()
    })

    const newMockAccountList = [
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
        }],
        _id: '0'
      }
    ]

    fetchMock.get(baseUrl, newMockAccountList)

    const suspendBtn = await screen.getByText('Suppression définitive')

    await act(async () => {
      fireEvent.click(suspendBtn)
    })

    const leavePopup = await screen.getByText('Annuler')

    await act(async () => {
      fireEvent.click(leavePopup)
    })
    sessionStorage.removeItem('role')
  })

  test('testing delete account error', async () => {
    sessionStorage.setItem('role', 'admin')
    fetchMock.delete(deleteUrl1, 403)
    fetchMock.delete(deleteUrl0, 403)
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

    await waitFor(async () => {
      expect(await accountRows).toHaveLength(4) // header row + 2 data rows
      expect(screen.getByText('Harry')).toBeInTheDocument()
      expect(screen.getByText('200, 201')).toBeInTheDocument()
      expect(screen.getByText('202')).toBeInTheDocument()
    })

    const suspendBtns = await screen.getAllByTestId('suspendBtn')

    await waitFor(async () => {
      expect(suspendBtns).toHaveLength(2)
    })

    await act(async () => {
      fireEvent.click(suspendBtns[1])
    })

    await waitFor(async () => {
      expect(screen.getByText('Suppression du Compte')).toBeInTheDocument()
    })

    const newMockAccountList = [
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
        }],
        _id: '0'
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
        ],
        _id: '1'
      }
    ]

    fetchMock.get(baseUrl, newMockAccountList)

    const suspendBtn = await screen.getByText('Suppression définitive')

    await act(async () => {
      fireEvent.click(suspendBtn)
    })

    const leavePopup = await screen.getByText('Annuler')

    await act(async () => {
      fireEvent.click(leavePopup)
    })
    sessionStorage.removeItem('role')
  })

  test('checks disconnect through user url', async () => {
    fetchMock.get(baseUrl, 401)
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
      expect(disconnect).toHaveBeenCalled()
    })
  })

  test('testing delete account disconnect', async () => {
    sessionStorage.setItem('role', 'admin')
    fetchMock.delete(deleteUrl1, 401)
    fetchMock.delete(deleteUrl0, 401)

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

    await waitFor(async () => {
      expect(await accountRows).toHaveLength(4) // header row + 2 data rows
      expect(screen.getByText('Harry')).toBeInTheDocument()
      expect(screen.getByText('200, 201')).toBeInTheDocument()
      expect(screen.getByText('202')).toBeInTheDocument()
    })

    const suspendBtns = await screen.getAllByTestId('suspendBtn')

    await waitFor(async () => {
      expect(suspendBtns).toHaveLength(2)
    })

    await act(async () => {
      fireEvent.click(suspendBtns[1])
    })

    await waitFor(async () => {
      expect(screen.getByText('Suppression du Compte')).toBeInTheDocument()
    })
    const suspendBtn = await screen.getByText('Suppression temporaire')

    await act(async () => {
      fireEvent.click(suspendBtn)
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
    sessionStorage.removeItem('role')
  })
})
