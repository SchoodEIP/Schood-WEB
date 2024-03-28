import React from 'react'
import '@testing-library/jest-dom'
import { render, act, screen, fireEvent } from '@testing-library/react'
import FormListPage from '../../../Users/Teacher/formListTeacherPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('FormListPage', () => {
  test('page successfully created', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    expect(screen.getByText('Mes Questionnaires')).toBeInTheDocument()
    expect(screen.getByText('Créer un Nouveau Questionnaire +')).toBeInTheDocument()
  })

  test('button to create new forms works', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: ''
    }

    const newFormBtn = screen.getByText('Créer un Nouveau Questionnaire +')

    await act(async () => {
      fireEvent.click(newFormBtn)
    })

    expect(window.location.href).toBe('/questionnaire')

    window.location = originalLocation
  })
})
