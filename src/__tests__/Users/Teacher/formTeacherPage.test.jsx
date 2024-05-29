import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import FormTeacherPage from '../../../Users/Teacher/formTeacherPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

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
    fromDate: '2026-09-03T00:00:00.000Z',
    title: 'Questionnaire test',
    toDate: '2026-09-09T00:00:00.000Z'
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
    sessionStorage.setItem('role', 'teacher')
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
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Questionnaire test')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('1.')).toBeInTheDocument()
      expect(screen.getByText('Comment te sens-tu à propos de ce test ?')).toBeInTheDocument()
    })

    const emojiButton = screen.getByTestId('question-container-0')

    await act(async () => {
      fireEvent.click(emojiButton)
    })

    await waitFor(() => {
      expect(screen.getByText('2.')).toBeInTheDocument()
      expect(screen.getByText('Elabores sur ta réponse à la question précédente')).toBeInTheDocument()
    })

    const textButton = screen.getByTestId('question-container-1')

    await act(async () => {
      fireEvent.click(textButton)
    })

    await waitFor(() => {
      expect(screen.getByText('3.')).toBeInTheDocument()
      expect(screen.getByText('Est-ce que le texte fonctionne ?')).toBeInTheDocument()
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
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
            </Routes>
          </WebsocketProvider>
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
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })
    await act(async () => {
      await expect(screen.getByText('this should work')).toBeInTheDocument()
    })
  })

  test('checks disconnect through asnwerList url', async () => {
    fetchMock.get(answerListUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  test('checks disconnect through student url', async () => {
    fetchMock.get(studentListUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  test('checks disconnect through questionnaireUrl url', async () => {
    fetchMock.get(questionnaireUrl, 401)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  test('checks modify form', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormTeacherPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Modifier le Questionnaire'))
    })
  })
})
