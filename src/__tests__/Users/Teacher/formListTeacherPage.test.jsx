import '@testing-library/jest-dom'
import React from 'react'
import { render, act, screen, fireEvent } from '@testing-library/react'
import FormListTeacherPage from '../../../Users/Teacher/formListTeacherPage'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('FormListTeacherPage', () => {
  const formUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire'
  let container = null
  const forms = [
    {
      _id: '123',
      title: 'Test',
      fromDate: "2023-12-24T00:00:00.000Z",
      toDate: "2023-12-30T00:00:00.000Z"
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
          <FormListTeacherPage />
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
          <FormListTeacherPage />
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

  test('recuperation of forms', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <FormListTeacherPage />
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
          <FormListTeacherPage />
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
