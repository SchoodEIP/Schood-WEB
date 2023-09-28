import React from 'react'
import '@testing-library/jest-dom'

import { render, screen, fireEvent, act } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import NewFormPage from '../../../Users/Teacher/newFormPage'
import { BrowserRouter } from 'react-router-dom'

describe('NewFormPage', () => {
  const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire'
  let container = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.post(questionnaireUrl, { message: 'Wrong date' })
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    jest.clearAllMocks()
    fetchMock.restore()
  })

  test('renders the page', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <NewFormPage />
        </BrowserRouter>
      )
    })

    expect(screen.getByText('Création de Questionnaire')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Titre du questionnaire')).toBeInTheDocument()
    expect(screen.getByText('Ajouter une Question')).toBeInTheDocument()
    expect(screen.getByText('Date de parution:')).toBeInTheDocument()
    expect(screen.getByText('Créer un Questionnaire')).toBeInTheDocument()
    expect(screen.getByTestId('parution-date')).toBeInTheDocument()
  })

  test('add and remove a question', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <NewFormPage />
        </BrowserRouter>
      )
    })

    const addQuestionBtn = screen.getByText('Ajouter une Question')

    act(() => {
      fireEvent.click(addQuestionBtn)
    })
    expect(screen.getByText('Question n° 1 :')).toBeInTheDocument()

    act(() => {
      fireEvent.click(addQuestionBtn)
    })
    expect(screen.getByText('Question n° 2 :')).toBeInTheDocument()

    const removeQuestionBtn = screen.getByText('Enlever une Question')

    act(() => {
      fireEvent.click(removeQuestionBtn)
    })

    expect(screen.queryByText('Question n° 2 :')).toBeNull()
    expect(screen.queryByText('Enlever une Question')).toBeNull()
  })

  test('create questionnaire', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <NewFormPage />
        </BrowserRouter>
      )
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: '/questionnaire'
    }

    const addQuestionBtn = screen.getByText('Ajouter une Question')

    act(() => {
      fireEvent.click(addQuestionBtn)
    })
    expect(screen.getByText('Question n° 1 :')).toBeInTheDocument()

    const createFormBtn = screen.getByText('Créer un Questionnaire')

    await act(async () => {
      fireEvent.click(createFormBtn)
    })

    expect(window.location.href).toBe('/questionnaires')

    window.location = originalLocation
  })


  test('fail to create questionnaire', async () => {

    window.fetch = jest.fn().mockResolvedValue({
      status: 400,
      json: jest.fn().mockResolvedValue({ message: 'Wrong Date' })
    })

    act(() => {
      render(
        <BrowserRouter>
          <NewFormPage />
        </BrowserRouter>
      )
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: '/questionnaire'
    }

    const addQuestionBtn = screen.getByText('Ajouter une Question')

    act(() => {
      fireEvent.click(addQuestionBtn)
    })
    expect(screen.getByText('Question n° 1 :')).toBeInTheDocument()

    const createFormBtn = screen.getByText('Créer un Questionnaire')

    await act(async () => {
      fireEvent.click(createFormBtn)
    })

    expect(window.location.href).toBe('/questionnaire')

    window.location = originalLocation

    expect(screen.getByText('Wrong Date')).toBeInTheDocument()
    expect(window.fetch).toHaveBeenCalledTimes(1)
  })

})
