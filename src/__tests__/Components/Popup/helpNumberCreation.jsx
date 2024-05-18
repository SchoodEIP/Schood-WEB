import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import HelpNumberCreationPopupContent from '../../../Components/Popup/helpNumberCreation'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/sharedFunctions'

jest.mock('../../../functions/sharedFunctions', () => ({
  disconnect: jest.fn(),
}));

describe('HelpNumberCreation', () => {
  const helpNumberRegisterUrl = process.env.REACT_APP_BACKEND_URL + '/adm/helpNumber/register'
  const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'

  const categories = [
    {
      _id: '0',
      name: 'Default'
    },
    {
      _id: '1',
      name: 'Aide contre le harcèlement'
    }
  ]
    beforeEach(() => {
      fetchMock.reset()
      fetchMock.config.overwriteRoutes = true
      fetchMock.get(categoryUrl, categories)
      fetchMock.post(helpNumberRegisterUrl, 401)
    })

    afterEach(() => {
      fetchMock.restore()
      })

    test('no categories exist', async () => {
      fetchMock.get(categoryUrl, [])
      await act(async () => {
        render(
          <BrowserRouter>
            <WebsocketProvider>
              <HelpNumberCreationPopupContent />
            </WebsocketProvider>
          </BrowserRouter>
        )
      })
    })


    test('checks disconnect through category url', async () => {
      fetchMock.get(categoryUrl, 401)
      await act(async () => {
        render(
          <BrowserRouter>
            <WebsocketProvider>
              <HelpNumberCreationPopupContent />
            </WebsocketProvider>
          </BrowserRouter>
        )
      })


      await waitFor(() => {
        expect(disconnect).toHaveBeenCalled();
      });
    })

    test('checks disconnect through helpNumbers url', async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <WebsocketProvider>
              <HelpNumberCreationPopupContent />
            </WebsocketProvider>
          </BrowserRouter>
        )
      })

      const nameInput = screen.getByPlaceholderText('Nom')
      const telephoneInput = screen.getByPlaceholderText('0000000000')
      const emailInput = screen.getByPlaceholderText('prenom.nom.Schood1@schood.fr')
      const descriptionInput = screen.getByPlaceholderText("Une description à propos de l'aide fournie")

      expect(nameInput).toHaveValue('')
      expect(telephoneInput).toHaveValue('')
      expect(emailInput).toHaveValue('')
      expect(descriptionInput).toHaveValue('')

      const selectCategory = screen.getByTestId('category-select')

      await act(async () => {
        fireEvent.change(selectCategory, { target: { value: '1' } })
      })

      const newCategoryBtn = screen.getByText('Créer le Numéro')

      await act(async () => {
        fireEvent.click(newCategoryBtn)
      })
      expect(screen.getByText('Le nom est vide.')).toBeInTheDocument()

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'Test' } })
      })

      await act(async () => {
        fireEvent.click(newCategoryBtn)
      })
      expect(screen.getByText('Veuillez fournir un numéro de téléphone valide (10 chiffres).')).toBeInTheDocument()

      await act(async () => {
        fireEvent.change(telephoneInput, { target: { value: '0298123712' } })
      })

      await act(async () => {
        fireEvent.click(newCategoryBtn)
      })
      expect(screen.getByText('Veuillez fournir une adresse email valide.')).toBeInTheDocument()

      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'test@schood.fr' } })
      })

      await act(async () => {
        fireEvent.click(newCategoryBtn)
      })
      expect(screen.getByText("Veuillez fournir une description de ce numéro d'aide.")).toBeInTheDocument()

      await act(async () => {
        fireEvent.change(descriptionInput, { target: { value: 'This is just a test' } })
      })

      expect(nameInput).toHaveValue('Test')
      expect(telephoneInput).toHaveValue('0298123712')
      expect(emailInput).toHaveValue('test@schood.fr')
      expect(descriptionInput).toHaveValue('This is just a test')

      await act(async () => {
        fireEvent.click(newCategoryBtn)
      })

      await waitFor(() => {
        expect(disconnect).toHaveBeenCalled();
      });
    })
  })
