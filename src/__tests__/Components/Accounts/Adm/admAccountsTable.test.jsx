import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdmAccountsTable from '../../../../Components/Accounts/Adm/admAccountsTable'
import { WebsocketProvider } from '../../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../../functions/disconnect'

jest.mock('../../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('AdmAccountsTable', () => {
  const baseUrl = process.env.REACT_APP_BACKEND_URL + '/user/all'
  const deleteUrl = process.env.REACT_APP_BACKEND_URL + '/adm/deleteUser/0'

  const mockAccountList = [
    {
      firstname: 'Harry',
      lastname: 'Dresden',
      email: 'harry.dresden@epitech.eu',
      _id: '0'
    },
    {
      firstname: 'John',
      lastname: 'Wick',
      email: 'john.wick@epitech.eu',
      _id: '1'
    }
  ]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(baseUrl, mockAccountList)
    fetchMock.delete(deleteUrl, 200)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('renders the table', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const table = screen.getAllByRole('table')
    expect(table[0]).toBeInTheDocument()
  })

  test('renders table headers correctly', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsTable />
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
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const accountRows = await screen.findAllByRole('row')
    await waitFor(async () => {
      expect(accountRows).toHaveLength(3) // header row + 2 data rows
    })
    await waitFor(async () => {
      expect(screen.getByText('Harry')).toBeInTheDocument()
    })

    await act(async () => {

    })
  })

  test('testing suspend account', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const suspendBtns = await screen.getAllByTestId('suspendBtn')

    await waitFor(async () => {
      expect(suspendBtns).toHaveLength(2)
    })

    await act(async() => {
      fireEvent.click(suspendBtns[0])
    })

    await waitFor(async () => {
      expect(screen.getByText("Suppression du Compte")).toBeInTheDocument()
    })

    const newMockAccountList = [
      {
        firstname: 'John',
        lastname: 'Wick',
        email: 'john.wick@epitech.eu',
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
  })

  test('testing delete account', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const suspendBtns = await screen.getAllByTestId('suspendBtn')

    await waitFor(async () => {
      expect(suspendBtns).toHaveLength(2)
    })

    await act(async() => {
      fireEvent.click(suspendBtns[0])
    })

    await waitFor(async () => {
      expect(screen.getByText("Suppression du Compte")).toBeInTheDocument()
    })

    const newMockAccountList = [
      {
        firstname: 'John',
        lastname: 'Wick',
        email: 'john.wick@epitech.eu',
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
  })


  test('testing suspend account error', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const suspendBtns = await screen.getAllByTestId('suspendBtn')

    await waitFor(async () => {
      expect(suspendBtns).toHaveLength(2)
    })

    await act(async() => {
      fireEvent.click(suspendBtns[0])
    })

    await waitFor(async () => {
      expect(screen.getByText("Suppression du Compte")).toBeInTheDocument()
    })

    fetchMock.delete(deleteUrl, 403)

    const newMockAccountList = [
      {
        firstname: 'John',
        lastname: 'Wick',
        email: 'john.wick@epitech.eu',
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
  })

  test('testing error baseurl', async () => {
    const mockAccountList = []
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockAccountList),
      status: 403,
      statusText: 'ERRCONNECT'
    })
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    await waitFor(async () => {
      expect(window.location.pathname).toBe('/')
    })
  })

  test('testing disconnect baseurl', async () => {
    fetchMock.get(baseUrl, 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })


  // test disconnect on delete account
  test('testing delete account disconnect', async () => {
    fetchMock.delete(deleteUrl, 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AdmAccountsTable />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const suspendBtns = await screen.getAllByTestId('suspendBtn')

    await waitFor(async () => {
      expect(suspendBtns).toHaveLength(2)
    })

    await act(async() => {
      fireEvent.click(suspendBtns[0])
    })

    await waitFor(async () => {
      expect(screen.getByText("Suppression du Compte")).toBeInTheDocument()
    })

    const suspendBtn = await screen.getByText('Suppression temporaire')

    await act(async () => {
      fireEvent.click(suspendBtn)
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

})
