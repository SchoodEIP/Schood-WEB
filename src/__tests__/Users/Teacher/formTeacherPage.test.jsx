import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import FormTeacherPage from '../../../Users/Teacher/formTeacherPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

describe('FormTeacherPage', () => {
  const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire/123'
  const answerListUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire/123/answers/64f72b4e06c0818813902624'
  const studentListUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire/123/students'
  let container = null

  const questionnaireResponse = {
    _id: '123',
    classes: [{ _id: '64f72b4d06c0818813902612', name: '200' }],
    createdBy: {
      _id: '64f72b4e06c0818813902620',
      email: 'teacher1@schood.fr',
      firstname: 'teacher1',
      lastname: 'teacher1'
    },
    questions: [
      {
        _id: '64fb230269a0b02380ee32a7',
        answers: [],
        title: 'Comment te sens-tu à propos de ce test ?',
        type: 'emoji'
      },
      {
        _id: '64fb230269a0b02380ee32a8',
        answers: [],
        title: 'Elabores sur ta réponse à la question précédente',
        type: 'text'
      },
      {
        _id: '64fb230269a0b02380ee32a9',
        answers: [
          {
            _id: '64fb230269a0b02380ee32ab',
            position: 0,
            title: 'oui'
          },
          {
            _id: '64fb230269a0b02380ee32ac',
            position: 1,
            title: 'non'
          }
        ],
        title: 'Est-ce que le texte fonctionne ?',
        type: 'multiple'
      }
    ],
    fromDate: '2023-09-03T00:00:00.000Z',
    title: 'Questionnaire test',
    toDate: '2023-09-09T00:00:00.000Z'
  }

  const studentsResponse = {
    _id: 1,
    users: [
      {
        _id: '64f72b4e06c0818813902624',
        classes: ['64f72b4d06c0818813902612'],
        email: 'student1@schood.fr',
        firstname: 'student1',
        lastname: 'student1'
      }
    ]
  }

  const answersResponse = {
    _id: '64fb242c19b9a22c8a0cde63',
    answers: [
      { question: '64fb230269a0b02380ee32a7', answer: ['1'], _id: '64fb242c19b9a22c8a0cde64' },
      { question: '64fb230269a0b02380ee32a8', answer: ['Bof'], _id: '64fb242c19b9a22c8a0cde65' },
      { question: '64fb230269a0b02380ee32a9', answer: ['0'], _id: '64fb242c19b9a22c8a0cde66' }
    ],
    createdBy: {
      _id: '64f72b4e06c0818813902624',
      email: 'student1@schood.fr',
      firstname: 'student1',
      lastname: 'student1'
    },
    date: '2023-09-08T00:00:00.000Z',
    questionnaire: '123'
  }

  beforeEach(() => {
    fetchMock.config.overwriteRoutes = true
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.get(questionnaireUrl, questionnaireResponse)
    fetchMock.get(studentListUrl, studentsResponse)
    fetchMock.get(answerListUrl, answersResponse)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    fetchMock.restore()
  })

  test('renders the page', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123']}>
          <Routes>
            <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Questionnaire test', { selector: 'h1' })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('1. Comment te sens-tu à propos de ce test ?', { selector: 'h2' })).toBeInTheDocument()
    })

    const emojiButton = screen.getByTestId('question-container-0')

    await act(async () => {
      fireEvent.click(emojiButton)
    })

    await waitFor(() => {
      expect(screen.getByText('2. Elabores sur ta réponse à la question précédente', { selector: 'h2' })).toBeInTheDocument()
    })

    const textButton = screen.getByTestId('question-container-1')

    await act(async () => {
      fireEvent.click(textButton)
    })

    await waitFor(() => {
      expect(screen.getByText('3. Est-ce que le texte fonctionne ?', { selector: 'h2' })).toBeInTheDocument()
    })

    const multiButton = screen.getByTestId('question-container-2')

    await act(async () => {
      fireEvent.click(multiButton)
    })

    await waitFor(() => {
      expect(screen.getByText('oui')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('question-container-2'))
    })
  })

  it('should handle errors', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network Error'))

    global.fetch = mockFetch

    await act(() => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123']}>
          <Routes>
            <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })
    await act(async () => {
      await expect(mockFetch()).rejects.toThrow('Network Error')
    })
  })

  it('should handle messages from questionnaire', async () => {
    fetchMock.get(questionnaireUrl, { message: 'this should work' })

    await act(() => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123']}>
          <Routes>
            <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })
    await act(async () => {
      await expect(screen.getByText('Erreur', { selector: 'h1' })).toBeInTheDocument()
    })
  })
})
