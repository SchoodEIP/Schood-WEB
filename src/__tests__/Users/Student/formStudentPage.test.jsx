import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import FormStudentPage from '../../../Users/Student/formStudentPage'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { WebsocketProvider } from '../../../contexts/websocket'

describe('FormStudentPage', () => {
  const id = '64f2f862b0975ae4340acafa'
  const questionnaireUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/` + id
  const sendAnswerUrl = `${process.env.REACT_APP_BACKEND_URL}/student/questionnaire/` + id

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
        answers: []
      },
      {
        title: 'what do you want ?',
        type: 'text',
        answers: []
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
        ]
      },
      {
        title: 'is this the last ?',
        type: 'other',
        answers: []
      }
    ],
    fromDate: thisWeekMonday.toISOString(),
    title: 'Test',
    toDate: thisWeekSunday.toISOString()
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.get(questionnaireUrl, exemple)
    fetchMock.post(sendAnswerUrl, {})
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    jest.clearAllMocks()
    fetchMock.restore()
  })

  test('retrives data', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(exemple)
    })

    global.fetch = mockFetch

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/64f2f862b0975ae4340acafa']}>
          <WebsocketProvider>
            <FormStudentPage />
          </WebsocketProvider>
        </MemoryRouter>
      )
    })
    const response = await mockFetch()
    expect(await response.json()).toEqual(exemple)

    expect(screen.getByTestId('form-header-title')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByTestId('question-container-0')).toBeInTheDocument()
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

    await waitFor(() => {
      expect(screen.getByTestId('answer-1-0')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('question-container-2')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByTestId('form-header-title')).toBeInTheDocument()
    })
  })

  it('should handle errors', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network Error'))

    global.fetch = mockFetch

    await act(() => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/64f2f862b0975ae4340acafa']}>
          <WebsocketProvider>
            <FormStudentPage />
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

    const validateBtn = screen.getByText('Valider le Questionnaire')

    await act(() => {
      fireEvent.click(validateBtn)
    })
  })
})
