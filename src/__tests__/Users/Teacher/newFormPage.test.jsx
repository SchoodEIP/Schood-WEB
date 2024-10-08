import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import NewFormPage from '../../../Users/Teacher/newFormPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('NewFormPage', () => {
  function getFormDates () {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diffThisWeekMonday = (today.getDate() + 7) - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust when today is Sunday
    const thisWeekMonday = new Date(today.setDate(diffThisWeekMonday))

    thisWeekMonday.setUTCHours(0, 0, 0, 0)

    const month = String(thisWeekMonday.getMonth() + 1).padStart(2, '0')
    const day = String(thisWeekMonday.getDate()).padStart(2, '0')
    const year = thisWeekMonday.getFullYear()
    return `${month}/${day}/${year}`
  }

  const thisWeekMonday = getFormDates()

  function formatDate (date) {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }

  const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire'
  let container = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.config.overwriteRoutes = true
    fetchMock.reset()
    fetchMock.post(questionnaireUrl, { })
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    jest.clearAllMocks()
    fetchMock.restore()
  })

  test('checks disconnect through questionnaire url', async () => {
    fetchMock.post(questionnaireUrl, 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const inputField = screen.getByPlaceholderText('Titre du questionnaire')
    fireEvent.change(inputField, { target: { value: 'Test Input' } })

    const questionInput = screen.getByPlaceholderText('Quelle est votre question ?')

    await act(() => {
      fireEvent.change(questionInput, { target: { value: 'Does this test work ?' } })
    })

    expect(questionInput).toHaveValue('Does this test work ?')

    const postButton = screen.getByText('Valider le Questionnaire')

    await act(async () => {
      fireEvent.click(postButton)
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  test('return button without changes', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const postButton = screen.getByText('Retour')

    await act(async () => {
      fireEvent.click(postButton)
    })
  })

  test('return button with changes', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const inputField = screen.getByPlaceholderText('Titre du questionnaire')
    fireEvent.change(inputField, { target: { value: 'Test Input' } })

    const questionInput = screen.getByPlaceholderText('Quelle est votre question ?')

    await act(() => {
      fireEvent.change(questionInput, { target: { value: 'Does this test work ?' } })
    })

    const postButton = screen.getByText('Retour')

    await act(async () => {
      fireEvent.click(postButton)
    })

    await waitFor(async () => {
      expect(screen.getByText('Sauvegarder les modifications ?'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText("Continuer l'édition"))
    })

    const newPostBtn = screen.getByText('Retour')

    await act(async () => {
      fireEvent.click(newPostBtn)
    })
  })

  test('renders the page', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    expect(screen.getByText("Création d'un Nouveau Questionnaire")).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Titre du questionnaire')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Quelle est votre question ?')).toBeInTheDocument()
    expect(screen.getByText('Date de parution :')).toBeInTheDocument()
    expect(screen.getByText('Valider le Questionnaire')).toBeInTheDocument()
    expect(screen.getByDisplayValue(`${thisWeekMonday}`)).toBeInTheDocument()
  })

  test('add and remove a question', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const addQuestionBtn = screen.getByText('+ Ajouter une Question')

    await act(() => {
      fireEvent.click(addQuestionBtn)
    })
    expect(screen.getByText('2.')).toBeInTheDocument()

    await act(() => {
      fireEvent.click(addQuestionBtn)
    })
    expect(screen.getByText('3.')).toBeInTheDocument()

    const removeQuestionBtn = screen.getByText('- Enlever la Dernière Question')

    await act(() => {
      fireEvent.click(removeQuestionBtn)
    })

    await act(() => {
      fireEvent.click(removeQuestionBtn)
    })

    expect(screen.queryByText('2.')).toBeNull()
    expect(screen.queryByText('- Enlever la Dernière Question')).toBeNull()
  })

  test('add and remove multiple answers', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const addQuestionBtn = screen.getByText('+ Ajouter une Question')

    await act(() => {
      fireEvent.click(addQuestionBtn)
    })
    expect(screen.getByText('1.')).toBeInTheDocument()

    const selectType = screen.getByTestId('select-0')
    expect(selectType).toBeInTheDocument()
    expect(selectType).toHaveValue('text')

    await act(() => {
      fireEvent.change(selectType, { target: { value: 'multiple' } })
    })
    expect(selectType).toHaveValue('multiple')

    const addAnswerBtn = screen.getByText('+ Ajouter une Réponse')
    expect(addAnswerBtn).toBeInTheDocument()

    await act(() => {
      fireEvent.click(addAnswerBtn)
    })

    const removeAnswerBtn = screen.getByText('- Enlever la Dernière Réponse')

    const inputElements1 = screen.getAllByPlaceholderText('Ajoutez une Réponse')

    await act(() => {
      fireEvent.change(inputElements1[0], { target: { value: 'This is an answer' } })
    })

    expect(inputElements1.length).toBe(3)

    await act(() => {
      fireEvent.click(removeAnswerBtn)
    })

    const inputElements2 = screen.getAllByPlaceholderText('Ajoutez une Réponse')
    expect(inputElements2.length).toBe(2)

    await act(() => {
      fireEvent.change(selectType, { target: { value: 'emoji' } })
    })
    expect(selectType).toHaveValue('emoji')

    const inputElements3 = screen.queryAllByPlaceholderText('Ajoutez une Réponse')
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

    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const inputField = screen.getByPlaceholderText('Titre du questionnaire')
    fireEvent.change(inputField, { target: { value: 'Test Input' } })

    const questionInput = screen.getByPlaceholderText('Quelle est votre question ?')
    const selectType = screen.getByTestId('select-0')

    await act(() => {
      fireEvent.change(questionInput, { target: { value: 'Does this test work ?' } })
      fireEvent.change(selectType, { target: { value: 'multiple' } })
    })

    expect(questionInput).toHaveValue('Does this test work ?')
    expect(selectType).toHaveValue('multiple')

    const postButton = screen.getByText('Valider le Questionnaire')

    await act(async () => {
      fireEvent.click(postButton)
      const response = await mockFetch()
      expect(await response.json()).toEqual(fakeData)
    })
  })

  it('should handle errors', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ status: 400, statusText: 'Error' })

    global.fetch = mockFetch

    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const postButton = screen.getByText('Valider le Questionnaire')

    await act(async () => {
      fireEvent.click(postButton)
    })

    await waitFor(() => {
      expect(screen.getByText("Le questionnaire n'a pas de titre.")).toBeInTheDocument()
    })

    const inputField = screen.getByPlaceholderText('Titre du questionnaire')
    fireEvent.change(inputField, { target: { value: 'Test Input' } })

    await act(async () => {
      fireEvent.click(postButton)
    })

    await waitFor(() => {
      expect(screen.getByText("Question n°1 n'a pas été renseignée.")).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(postButton)
    })

    const questionInput = screen.getByPlaceholderText('Quelle est votre question ?')

    await act(() => {
      fireEvent.change(questionInput, { target: { value: 'Does this test work ?' } })
    })

    const otherFetch = jest.fn().mockRejectedValue(new Error('Network Error'))

    global.fetch = otherFetch

    await act(async () => {
      fireEvent.click(postButton)
    })

    await waitFor(async () => {
      expect(screen.getByText('Network Error')).toBeInTheDocument()
    })
  })

  test('create questionnaire', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: '/questionnaire'
    }

    const inputField = screen.getByPlaceholderText('Titre du questionnaire')
    fireEvent.change(inputField, { target: { value: 'Test Input' } })

    expect(screen.getByText('1.')).toBeInTheDocument()

    const questionInput = screen.getByPlaceholderText('Quelle est votre question ?')

    await act(() => {
      fireEvent.change(questionInput, { target: { value: 'Does this test work ?' } })
    })

    const createFormBtn = screen.getByText('Valider le Questionnaire')

    await act(async () => {
      fireEvent.click(createFormBtn)
    })

    await waitFor(async () => {
      expect(window.location.href).toBe('/questionnaires')
    })

    window.location = originalLocation
  })

  test('pick a date', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    // Get today's date
    const today = new Date()
    const todayDayOfWeek = today.getDay() // 0 for Sunday, 1 for Monday, ...

    // Calculate the next Monday
    const nextMonday = new Date(today)
    nextMonday.setDate(today.getDate() + ((1 + 7 - todayDayOfWeek) % 7))

    const datePickerInput = screen.getByDisplayValue(`${thisWeekMonday}`)
    // Convert next Monday to ISO string (YYYY-MM-DD)
    const nextMondayFormatted = formatDate(nextMonday)

    // Set the input value to the next Monday
    userEvent.type(datePickerInput, nextMondayFormatted)

    // Ensure the input value is set to the next Monday
    expect(datePickerInput).toHaveValue(nextMondayFormatted)
  })

  test('fail to create questionnaire', async () => {
    window.fetch = jest.fn().mockResolvedValue({
      status: 400,
      json: jest.fn().mockResolvedValue({ message: 'Wrong Date' })
    })

    await act(() => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <NewFormPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: '/questionnaire'
    }

    const addQuestionBtn = screen.getByText('+ Ajouter une Question')

    await act(() => {
      fireEvent.click(addQuestionBtn)
    })
    expect(screen.getByText('1.')).toBeInTheDocument()

    const createFormBtn = screen.getByText('Valider le Questionnaire')

    await act(async () => {
      fireEvent.click(createFormBtn)
    })

    expect(window.location.href).toBe('/questionnaire')

    window.location = originalLocation

    // expect(window.fetch).toHaveBeenCalledTimes(1)
  })
})
