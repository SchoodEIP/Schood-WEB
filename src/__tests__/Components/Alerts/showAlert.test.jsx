import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import ShowAlerts from '../../../Components/Alerts/showAlerts'

describe('ShowAlerts component', () => {
  const chosenAlert = {
    id: '1',
    message: 'message',
    createdAt: '17/05/2024',
    file: '',
    createdBy: {
      active: true,
      classes: [],
      createdAt: '2024-05-06T09:46:56.007Z',
      email: 'admin.Schood1@schood.fr',
      facility: '6638a70fdd18a1e42e53944d',
      firstConnexion: true,
      firstname: 'admin',
      lastname: 'admin',
      password: '$2a$10$4iOhCFDzycZem7nY.Ba3.u.19bYVpS524ABPQRAeYibRnxclHkqsa',
      role: '6638a70fdd18a1e42e53944a',
      title: {
        facility: '6638a70fdd18a1e42e53944d',
        name: 'Administrateur',
        __v: 0,
        _id: '6638a70fdd18a1e42e539453'
      },
      updatedAt: '2024-05-06T09:46:56.007Z',
      __v: 0,
      _id: '6638a710dd18a1e42e539472'
    },
    title: 'Title'
  }

  const emptyAlert = {
    id: '1',
    message: null,
    createdAt: null,
    file: 'dfsdsq',
    createdBy: null,
    title: null
  }

  it('should render the showAlert Component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ShowAlerts chosenAlert={chosenAlert} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(async () => {
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('message')).toBeInTheDocument()
      expect(screen.getByText('Administrateur')).toBeInTheDocument()
      expect(screen.getByText('Date de Publication : 17/05/2024')).toBeInTheDocument()
    })
  })

  it('should show the error message', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ShowAlerts chosenAlert={null} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(async () => {
      expect(screen.getByText("Cette alerte n'existe pas.")).toBeInTheDocument()
    })
  })

  it('should show empty areas', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ShowAlerts chosenAlert={emptyAlert} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
  })
})
