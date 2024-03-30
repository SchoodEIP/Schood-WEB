import '@testing-library/jest-dom'
import React from 'react'
import { render, act, screen, fireEvent } from '@testing-library/react'
import FormListStudentPage from '../../../Users/Student/formListStudentPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('FormListStudentPage', () => {
  const formUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire'
  let container = null
  const forms = [
    {
      _id: '123',
      title: 'Test',
      fromDate: '2023-12-24T00:00:00.000Z',
      toDate: '2023-12-30T00:00:00.000Z'
    }
  ]

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.get(formUrl, forms)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    fetchMock.restore()
  })

  test('page successfully created', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    expect(screen.getByText('Mes Questionnaires')).toBeInTheDocument()
  })

  test('recuperation of forms', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    expect(screen.getByText('Y Accéder')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Du 24/12/23 au 30/12/23')).toBeInTheDocument()
  })

  test('redirect to specific form', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: ''
    }

    const accessFormBtn = screen.getByText('Y Accéder')

    await act(async () => {
      fireEvent.click(accessFormBtn)
    })

    expect(window.location.href).toBe('/questionnaire/123')

    window.location = originalLocation
  })
})
