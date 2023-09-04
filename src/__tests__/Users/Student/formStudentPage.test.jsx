import React from 'react'
import '@testing-library/jest-dom/'
import { render, screen, act, waitFor } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import FormStudentPage from '../../../Users/Student/formStudentPage'
import { BrowserRouter } from 'react-router-dom'

describe('FormStudentPage', () => {
  const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire/64f2f862b0975ae4340acafa'
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
    fromDate: '2023-08-27T00:00:00.000Z',
    title: 'Test',
    toDate: '2023-09-02T00:00:00.000Z'
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.get(questionnaireUrl, exemple)
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
        <BrowserRouter initialEntries={['/questionnaire/64f2f862b0975ae4340acafa']}>
          <FormStudentPage />
        </BrowserRouter>
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

    act(() => {
      render(
        <BrowserRouter>
          <FormStudentPage />
        </BrowserRouter>
      )
    })
    await act(async () => {
      await expect(mockFetch()).rejects.toThrow('Network Error')
    })
  })
})
