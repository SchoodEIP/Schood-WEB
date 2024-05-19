import '@testing-library/jest-dom'
import React from 'react'
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react'
import FormListTeacherPage from '../../../Users/Teacher/formListTeacherPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn(),
}));

describe('FormListTeacherPage', () => {
  const formUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire'
  let container = null
  const forms = [
    {

      fromDate: '2023-12-24T00:00:00.000Z',
      toDate: '2023-12-30T00:00:00.000Z',
      questionnaires: [
        {
          facility: "6638a70fdd18a1e42e53944d",
          createdBy: {
            active: true,
            createdAt: "2024-05-06T09:46:56.164Z",
            email: "pierre.dubois.Schood1@schood.fr",
            firstname: "Pierre",
            lastname: "Dubois",
            picture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQA",
            updatedAt: "2024-05-06T09:46:56.164Z",
            __v: 0,
            _id: "6638a710dd18a1e42e539476"
          },
          _id: '123',
          title: 'Test',
          classes: [{
            name: '200',
            _id: '123'
          }]
        }
      ]

    }
  ]

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.get(formUrl, forms)
    fetchMock.config.overwriteRoutes = true
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    fetchMock.restore()
  })

  test('checks disconnect through formUrl url', async () => {
    fetchMock.get(formUrl, 401)

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListTeacherPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  test('page successfully created', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListTeacherPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    expect(screen.getByText('Mes Questionnaires')).toBeInTheDocument()
    expect(screen.getByText('Créer un Questionnaire')).toBeInTheDocument()
  })

  test('button to create new forms works', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListTeacherPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: ''
    }

    const newFormBtn = screen.getByText('Créer un Questionnaire')

    await act(async () => {
      fireEvent.click(newFormBtn)
    })

    expect(window.location.href).toBe('/questionnaire')

    window.location = originalLocation
  })

  test('recuperation of forms', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListTeacherPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Du 24/12/2023 au 30/12/2023')).toBeInTheDocument()
  })

  test('redirect to specific form', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListTeacherPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: ''
    }

    const accessFormBtn = screen.getByText('Test')

    await act(async () => {
      fireEvent.click(accessFormBtn)
    })

    window.location = originalLocation
  })
})
