import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import FormStudentPage from '../../../Users/Student/formStudentPage'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { disconnect } from '../../../functions/sharedFunctions'

jest.mock('../../../functions/sharedFunctions', () => ({
  disconnect: jest.fn(),
}));

describe('FormStudentPage', () => {
  const id = '64f2f862b0975ae4340acafa'
  const questionnaireUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/` + id
  const answerUrl = `${process.env.REACT_APP_BACKEND_URL}/student/questionnaire/` + id

  function getFormDates () {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diffThisWeekMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust when today is Sunday
    const thisWeekMonday = new Date(today.setDate(diffThisWeekMonday))

    thisWeekMonday.setUTCHours(0, 0, 0, 0)

    const thisWeekSunday = new Date(thisWeekMonday)

    thisWeekSunday.setDate(thisWeekSunday.getDate() + 6)
    thisWeekSunday.setUTCHours(23, 59, 59, 0)

    return [thisWeekMonday, thisWeekSunday]
  }

  const [thisWeekMonday, thisWeekSunday] = getFormDates()

  let container = null
  const exemple = {
    _id: '64f2f862b0975ae4340acafa',
    classes: [
      {
        _id: '64f2f829b0975ae4340acad6',
        name: '200'
      },
      {
        _id: '64f2f829b0975ae4340acad7',
        name: '201'
      }],
    createdBy: {
      _id: '64f2f829b0975ae4340acae4',
      email: 'teacher1@schood.fr',
      firstname: 'teacher1',
      lastname: 'teacher1'
    },
    questions: [
      {
        title: 'is this a test ?',
        type: 'emoji',
        answers: [],
        _id: '1'
      },
      {
        title: 'what do you want ?',
        type: 'text',
        answers: [],
        _id: '2'
      },
      {
        title: 'How do you feel ?',
        type: 'multiple',
        answers: [
          {
            title: 'sad',
            position: 0
          },
          {
            title: 'normal',
            position: 1
          },
          {
            title: 'happy',
            position: 2
          }
        ],
        _id: '3'
      },
      {
        title: 'what do you want again ?',
        type: 'text',
        answers: [],
        _id: '4'
      },
    ],
    fromDate: thisWeekMonday.toISOString(),
    title: 'Test',
    toDate: thisWeekSunday.toISOString()
  }

  const exempleAnswer = {
    answers: [
      {
        question: '1',
        _id: '01',
        answers: ['2']
      },
      {
        question: '2',
        _id: '02',
        answers: ['Plein de choses']
      },
      {
        question: '3',
        _id: '03',
        answers: ['sad']
      }
    ],
    createdBy: '123',
    date: thisWeekMonday.toISOString(),
    _id: '1'
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.config.overwriteRoutes = true
    fetchMock.reset()
    fetchMock.get(questionnaireUrl, exemple)
    fetchMock.get(answerUrl, null)
    fetchMock.post(answerUrl, {})
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    jest.clearAllMocks()
    fetchMock.restore()
  })

  test('checks disconnect through form url', async () => {
    fetchMock.get(questionnaireUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/64f2f862b0975ae4340acafa']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormStudentPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  test('checks disconnect through answer url', async () => {
    fetchMock.get(answerUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/64f2f862b0975ae4340acafa']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormStudentPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  test('checks disconnect through post answer url', async () => {
    fetchMock.post(answerUrl, 401)
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/64f2f862b0975ae4340acafa']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormStudentPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const validateBtn = screen.getByText('Envoyer le questionnaire')

    await act(() => {
      fireEvent.click(validateBtn)
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  test('retrieves data and modifies it', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(exemple)
    })

    global.fetch = mockFetch

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/64f2f862b0975ae4340acafa']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormStudentPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })
    const response = await mockFetch()
    expect(await response.json()).toEqual(exemple)

    await waitFor(() => {
      expect(screen.getByTestId('question-container-0')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByText('is this a test ?'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('answer-0-0')).toBeInTheDocument()
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('answer-0-0'))
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('answer-0-1'))
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('answer-0-2'))
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('answer-0-3'))
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('answer-0-4'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('answer-0-1')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('answer-0-2')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('question-container-1')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('question-container-1'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('answer-1-0')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('question-container-2')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('question-container-2'))
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('answer-2-0'))
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('answer-2-0'))
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('question-container-2'))
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('question-container-3'))
    })

    const textInput = screen.getByTestId('answer-3-0')
    await act(async () => {
      fireEvent.change(textInput, { value: 'blah'})
    })

    const validateBtn = screen.getByText('Envoyer le questionnaire')

    await act(() => {
      fireEvent.click(validateBtn)
    })
  })

  test('retrives answers', async () => {
    fetchMock.get(answerUrl, exempleAnswer)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/64f2f862b0975ae4340acafa']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormStudentPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByTestId('question-container-0')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByText('is this a test ?'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('answer-0-0')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('answer-0-1')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('answer-0-2')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('question-container-1')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('question-container-1'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('answer-1-0')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('question-container-2')).toBeInTheDocument()
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
        <MemoryRouter initialEntries={['/questionnaire/64f2f862b0975ae4340acafa']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormStudentPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })
    await act(async () => {
      await expect(mockFetch()).rejects.toThrow('Network Error')
    })
  })

  it('should answer form', async () => {
    await act(() => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/64f2f862b0975ae4340acafa']}>
          <WebsocketProvider>
            <Routes>
              <Route path='/questionnaire/:id' element={<FormStudentPage />} />
            </Routes>
          </WebsocketProvider>
        </MemoryRouter>
      )
    })

    const validateBtn = screen.getByText('Envoyer le questionnaire')

    await act(() => {
      fireEvent.click(validateBtn)
    })
  })
})
