import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import CategoryCreationPopupContent from '../../../Components/Popup/categoryCreation'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('CategoryCreation', () => {
  const categoryRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumbersCategory/register'

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.post(categoryRegisterUrl, 401)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  test('checks disconnect through category creation', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <CategoryCreationPopupContent />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const nameInput = screen.getByPlaceholderText('Nom')
    expect(nameInput).toHaveValue('')
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Violence' } })
    })
    expect(nameInput).toHaveValue('Violence')
    const newCategoryBtn = screen.getByText('Créer la Catégorie')
    await act(async () => {
      fireEvent.click(newCategoryBtn)
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })
})
