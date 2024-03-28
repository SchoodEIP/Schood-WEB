import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProfilPage from '../../../Components/Profil/profilPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

// Mocking the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com'
    })
  })
)

describe('ProfilPage component', () => {
  it('renders profil page with user information', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ProfilPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Wait for the fetch request to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    // Check if user information is rendered
    expect(screen.getByText('Profil utilisateur')).toBeInTheDocument()
    expect(screen.getByText('Nom:')).toBeInTheDocument()
    expect(screen.getByText('Email:')).toBeInTheDocument()
  })

  it('renders error message if there is an issue with fetching user data', async () => {
    // Mocking fetch to simulate an error
    global.fetch = jest.fn(() => Promise.reject(new Error('Fetch error')))

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ProfilPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Wait for the fetch request to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    // Check if error message is rendered
    expect(screen.getByText('Erreur lors de la récupération du profil')).toBeInTheDocument()
  })
})
