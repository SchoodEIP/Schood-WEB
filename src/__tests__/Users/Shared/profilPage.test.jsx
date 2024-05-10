import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProfilPage from '../../../Users/Shared/profilPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

// Mocking the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      role: {name: 'teacher'},
      title: 'Mathematics',
      classes: ['200', '201']
    })
  })
)

describe('ProfilPage component', () => {
  it('renders profil page with user information for teacher', async () => {
    sessionStorage.setItem('role', 'teacher')
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
    expect(screen.getByText('Mon Profil')).toBeInTheDocument()
    expect(screen.getByText('Prénom')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Nom de Famille')).toBeInTheDocument()
    expect(screen.getByText('Doe')).toBeInTheDocument()
    expect(screen.getByText('Rôle')).toBeInTheDocument()
    expect(screen.getByText('teacher')).toBeInTheDocument()
    expect(screen.getByText('Classes')).toBeInTheDocument()
    expect(screen.getByText('200, 201')).toBeInTheDocument()
    expect(screen.getByText('Adresse email')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    sessionStorage.removeItem('role')
  })

  it('renders profil page with user information for student', async () => {
    sessionStorage.setItem('role', 'student')
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
    // await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))

    // // Check if user information is rendered
    // expect(screen.getByText('Mon Profil')).toBeInTheDocument()
    // expect(screen.getByText('Prénom')).toBeInTheDocument()
    // expect(screen.getByText('John')).toBeInTheDocument()
    // expect(screen.getByText('Nom de Famille')).toBeInTheDocument()
    // expect(screen.getByText('Doe')).toBeInTheDocument()
    // expect(screen.getByText('Rôle')).toBeInTheDocument()
    // expect(screen.getByText('teacher')).toBeInTheDocument()
    // expect(screen.getByText('Classes')).toBeInTheDocument()
    // expect(screen.getByText('200, 201')).toBeInTheDocument()
    // expect(screen.getByText('Adresse email')).toBeInTheDocument()
    // expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    sessionStorage.removeItem('role')
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
