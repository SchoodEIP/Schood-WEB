import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProfilPage from '../../../Users/Shared/profilPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn(),
}));

describe('ProfilPage component', () => {
  const profileUrl = `${process.env.REACT_APP_BACKEND_URL}/user/profile`

  const teacherProfile = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    role: {name: 'teacher'},
    title: 'Mathematics',
    classes: [{name: '200'}, {name: '201'}],
    picture: 'sqdfsd'
  }

  const studentProfile = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    role: {name: 'student'},
    title: '',
    classes: [{name: '201'}],
    picture: null
  }

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.config.overwriteRoutes = true
    fetchMock.get(profileUrl, teacherProfile)
  })

  afterEach(() => {
    fetchMock.restore()
  })

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

    await waitFor(async () => {
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
    })
    sessionStorage.removeItem('role')
  })

  it('renders profil page with user information for student', async () => {
    fetchMock.get(profileUrl, studentProfile)

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

    // Check if user information is rendered
    await waitFor(async () => {
      expect(screen.getByText('Mon Profil')).toBeInTheDocument()
      expect(screen.getByText('Prénom')).toBeInTheDocument()
      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByText('Nom de Famille')).toBeInTheDocument()
      expect(screen.getByText('Doe')).toBeInTheDocument()
      expect(screen.getByText('Rôle')).toBeInTheDocument()
      expect(screen.getByText('student')).toBeInTheDocument()
      expect(screen.getByText('Classe')).toBeInTheDocument()
      expect(screen.getByText('201')).toBeInTheDocument()
      expect(screen.getByText('Adresse email')).toBeInTheDocument()
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    })
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

  it('tests disconnect', async () => {
    fetchMock.get(profileUrl, 401)

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ProfilPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })
})
