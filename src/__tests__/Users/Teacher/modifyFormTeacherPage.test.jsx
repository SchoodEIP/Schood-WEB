import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import ModifyFormTeacherPage from '../../../Users/Teacher/modifyFormTeacherPage'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

describe('ModifyFormTeacherPage', () => {
  const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire/123'
  const changeQuestionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire/123'
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
          },
          {
            _id: '64fb230269a0b02380ee32ad',
            position: 2,
            title: 'peut-être'
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

  beforeEach(() => {
    fetchMock.config.overwriteRoutes = true
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.get(questionnaireUrl, questionnaireResponse)
    fetchMock.patch(changeQuestionnaireUrl, { status: 200 })
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    fetchMock.restore()
  })

  test('renders the page', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123/modify']}>
          <Routes>
            <Route path='/questionnaire/:id/modify' element={<ModifyFormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    const titleInput = screen.getByPlaceholderText('Titre du questionnaire')
    await waitFor(() => {
      expect(titleInput).toBeInTheDocument()
    })
    expect(titleInput).toHaveValue('Questionnaire test')

    const selectType = screen.getByTestId('select-0')
    expect(selectType).toBeInTheDocument()
    expect(selectType).toHaveValue('emoji')

    await act(() => {
      fireEvent.change(selectType, { target: { value: 'text' } })
    })
    expect(selectType).toHaveValue('text')
  })

  it('adds and removes an answer', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123/modify']}>
          <Routes>
            <Route path='/questionnaire/:id/modify' element={<ModifyFormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    const addAnswerBtn = screen.getAllByText('Ajouter une Réponse')
    expect(addAnswerBtn[2]).toBeInTheDocument()

    act(() => {
      fireEvent.click(addAnswerBtn[2])
    })

    const removeAnswerBtn = screen.getAllByText('Enlever une Réponse')

    const inputElements1 = screen.getAllByPlaceholderText('Choix possible')

    expect(inputElements1.length).toBe(4)

    act(() => {
      fireEvent.click(removeAnswerBtn[2])
    })

    const inputElements2 = screen.getAllByPlaceholderText('Choix possible')
    expect(inputElements2.length).toBe(3)
  })

  it('should handle errors', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123/modify']}>
          <Routes>
            <Route path='/questionnaire/:id/modify' element={<ModifyFormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: '/questionnaire/123/modify'
    }
    window.fetch = jest.fn().mockResolvedValue({
      status: 400,
      json: jest.fn().mockResolvedValue({ message: 'Big error' })
    })

    const postButton = screen.getByText('Modifier le Questionnaire')
    expect(postButton).toBeInTheDocument()

    act(() => {
      fireEvent.click(postButton)
    })

    expect(window.location.href).toBe('/questionnaire/123/modify')
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledTimes(1)
    })
    window.location = originalLocation
  })

  it('should send the modified the questionnaire', async () => {
    window.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({ message: 'It works' })
    })
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123/modify']}>
          <Routes>
            <Route path='/questionnaire/:id/modify' element={<ModifyFormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledTimes(1)
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: '/questionnaire/123/modify'
    }
    const postButton = screen.getByText('Modifier le Questionnaire')
    expect(postButton).toBeInTheDocument()

    act(() => {
      fireEvent.click(postButton)
    })

    await waitFor(() => {
      expect(window.location.href).toBe('/questionnaire/123')
    })
    expect(window.fetch).toHaveBeenCalledTimes(2)
    window.location = originalLocation
  })

  it('catches an error on the GET', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network Error'))

    global.fetch = mockFetch

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123/modify']}>
          <Routes>
            <Route path='/questionnaire/:id/modify' element={<ModifyFormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    await act(async () => {
      await expect(mockFetch()).rejects.toThrow('Network Error')
    })
  })

  it('catches an error on the PATCH', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123/modify']}>
          <Routes>
            <Route path='/questionnaire/:id/modify' element={<ModifyFormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    const mockFetch = jest.fn().mockRejectedValue(new Error('Network Error'))

    global.fetch = mockFetch

    const postButton = screen.getByText('Modifier le Questionnaire')
    expect(postButton).toBeInTheDocument()

    await act(() => {
      fireEvent.click(postButton)
    })

    await act(async () => {
      await expect(mockFetch()).rejects.toThrow('Network Error')
    })
  })

  it('changes a select to multiple', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123/modify']}>
          <Routes>
            <Route path='/questionnaire/:id/modify' element={<ModifyFormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    const selectType = screen.getByTestId('select-0')
    await waitFor(() => {
      expect(selectType).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(selectType).toHaveValue('emoji')
    })

    await act(() => {
      fireEvent.change(selectType, { target: { value: 'multiple' } })
    })
    await waitFor(() => {
      expect(selectType).toHaveValue('multiple')
    })

    const allAnswersInput = screen.getAllByPlaceholderText('Choix possible')

    await waitFor(() => {
      expect(allAnswersInput[0]).toHaveValue('')
    })
  })

  it('adds a new question and removes all questions', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123/modify']}>
          <Routes>
            <Route path='/questionnaire/:id/modify' element={<ModifyFormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    const addQuestionBtn = screen.getByText('Ajouter une Question')

    await act(() => {
      fireEvent.click(addQuestionBtn)
    })
    await waitFor(() => {
      expect(screen.getByText('Question n° 4 :')).toBeInTheDocument()
    })

    const selectType = screen.getByTestId('select-3')
    await waitFor(() => {
      expect(selectType).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(selectType).toHaveValue('text')
    })

    await act(() => {
      fireEvent.change(selectType, { target: { value: 'multiple' } })
    })
    await waitFor(() => {
      expect(selectType).toHaveValue('multiple')
    })

    const addAnswerBtn = screen.getAllByText('Ajouter une Réponse')
    await waitFor(() => {
      expect(addAnswerBtn.length).toBe(4)
    })

    act(() => {
      fireEvent.click(addAnswerBtn[3])
    })

    const removeAnswerBtn = screen.getAllByText('Enlever une Réponse')

    const inputElements1 = screen.getAllByPlaceholderText('Choix possible')

    expect(inputElements1.length).toBe(6)

    act(() => {
      fireEvent.click(removeAnswerBtn[3])
    })

    const inputElements2 = screen.getAllByPlaceholderText('Choix possible')
    expect(inputElements2.length).toBe(5)

    const removeQuestionBtn = screen.getByText('Enlever une Question')

    await act(() => {
      fireEvent.click(removeQuestionBtn)
    })
    await waitFor(() => {
      expect(screen.queryByText('Question n° 4 :')).not.toBeInTheDocument()
    })

    await act(() => {
      fireEvent.click(removeQuestionBtn)
    })
    await act(() => {
      fireEvent.click(removeQuestionBtn)
    })
    await act(() => {
      fireEvent.click(removeQuestionBtn)
    })
    await act(() => {
      fireEvent.click(removeQuestionBtn)
    })
  })

  it('changes the date', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/questionnaire/123/modify']}>
          <Routes>
            <Route path='/questionnaire/:id/modify' element={<ModifyFormTeacherPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    const datetime = screen.getByTestId('parution-date')

    await waitFor(() => {
      screen.getByTestId('parution-date')
    })

    act(() => {
      fireEvent.change(datetime, { target: { value: '2026-02-10' } })
    })
    expect(datetime).toHaveValue('2026-02-10')
  })
})
