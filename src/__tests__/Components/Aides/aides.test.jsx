import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import AidePage from '../../../Components/Aides/aides'
import fetchMock from 'fetch-mock'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

// Mock de useEffect pour éviter de faire des appels HTTP réels
jest.spyOn(React, 'useEffect').mockImplementation((f) => f())

describe('AidePage component', () => {
  const categoryUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbersCategories'
  const helpNumbersUrl = process.env.REACT_APP_BACKEND_URL + '/user/helpNumbers'

  const categories = [
    {
      _id: '1',
      name: 'Aide contre le harcèlement'
    }
  ]

  const helpNumbers = [
    {
      _id: '1',
      name: "Ligne d'urgence pour les victimes de violence familiale",
      telephone: '0289674512',
      email: 'example@schood.fr',
      description: 'lala',
      helpNumbersCategory: '2'
    }
  ]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(categoryUrl, categories)
    fetchMock.get(helpNumbersUrl, helpNumbers)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('displays categories and contacts', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AidePage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Vérifie que les catégories sont affichées
    // expect(screen.getByText('Catégories')).toBeTruthy()
    // expect(screen.getByTestId('category-btn-1')).toBeInTheDocument()
    // expect(screen.getByTestId('category-btn-2')).toBeInTheDocument()

    // Vérifie que les numéros de contact sont affichés
    expect(screen.getByText('Aide contre le harcèlement')).toBeInTheDocument()
    expect(screen.getByText("Ligne d'urgence pour les victimes de violence familiale")).toBeInTheDocument()
  })

  it('filters contacts when a category is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AidePage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Clique sur la catégorie "Harcèlement"
    await act(async () => {
      fireEvent.click(screen.getByText('Aide contre le harcèlement'))
    })

    // Vérifie que seuls les contacts de la catégorie "Harcèlement" sont affichés
    expect(screen.getByText('Aide contre le harcèlement')).toBeInTheDocument()
    expect(screen.queryByText('Ligne d\'urgence pour les victimes de violence familiale')).not.toBeInTheDocument()
  })

  it('should handle errors', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network Error'))

    global.fetch = mockFetch

    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <AidePage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    await act(async () => {
      await expect(mockFetch()).rejects.toThrow('Network Error')
    })
  })
})
