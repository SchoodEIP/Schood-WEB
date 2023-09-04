import React from 'react'
import '@testing-library/jest-dom/'
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
    fetchMock.post(questionnaireUrl, { })
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

  test('add and remove multiple answers', async () => {
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

    const selectType = screen.getByTestId('select-0')
    expect(selectType).toBeInTheDocument()
    expect(selectType).toHaveValue('text')

    act(() => {
      fireEvent.change(selectType, { target: { value: 'multiple' } })
    })
    expect(selectType).toHaveValue('multiple')

    const addAnswerBtn = screen.getByText('Ajouter une Réponse')
    expect(addAnswerBtn).toBeInTheDocument()

    act(() => {
      fireEvent.click(addAnswerBtn)
    })

    const removeAnswerBtn = screen.getByText('Enlever une Réponse')

    const inputElements1 = screen.getAllByPlaceholderText('Choix possible')

    expect(inputElements1.length).toBe(3)

    act(() => {
      fireEvent.click(removeAnswerBtn)
    })

    const inputElements2 = screen.getAllByPlaceholderText('Choix possible')
    expect(inputElements2.length).toBe(2)

    act(() => {
      fireEvent.change(selectType, { target: { value: 'emoji' } })
    })
    expect(selectType).toHaveValue('emoji')

    const inputElements3 = screen.queryAllByPlaceholderText('Choix possible')
    expect(inputElements3.length).toBe(0)
  })

  it('should post questions to the backend', async () => {
    const fakeData = {
      title: 'Test Input',
      date: '',
      questions: [
        {
          title: 'Does this test work ?',
          type: 'multiple',
          answers: [
            {
              title: '',
              position: 0
            },
            {
              title: '',
              position: 1
            }
          ]
        }
      ]
    }
    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(fakeData)
    })

    global.fetch = mockFetch

    act(() => {
      render(
        <BrowserRouter>
          <NewFormPage />
        </BrowserRouter>
      )
    })
    const inputField = screen.getByPlaceholderText('Titre du questionnaire')
    fireEvent.change(inputField, { target: { value: 'Test Input' } })

    const addQuestionBtn = screen.getByText('Ajouter une Question')
    fireEvent.click(addQuestionBtn)

    const questionInput = screen.getByPlaceholderText('Quelle est votre question ?')
    const selectType = screen.getByTestId('select-0')

    act(() => {
      fireEvent.change(questionInput, { target: { value: 'Does this test work ?' } })
      fireEvent.change(selectType, { target: { value: 'multiple' } })
    })

    expect(questionInput).toHaveValue('Does this test work ?')
    expect(selectType).toHaveValue('multiple')

    const postButton = screen.getByText('Créer un Questionnaire')

    await act(async () => {
      fireEvent.click(postButton)
      const response = await mockFetch()
      expect(await response.json()).toEqual(fakeData)
    })
  })

  it('should handle errors', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network Error'))

    global.fetch = mockFetch

    act(() => {
      render(
        <BrowserRouter>
          <NewFormPage />
        </BrowserRouter>
      )
    })

    const postButton = screen.getByText('Créer un Questionnaire')

    await act(async () => {
      fireEvent.click(postButton)
      await expect(mockFetch()).rejects.toThrow('Network Error')
    })
  })
})
