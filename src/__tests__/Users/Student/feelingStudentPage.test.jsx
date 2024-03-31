import React from 'react'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import FeelingsStudentPage from '../../../Users/Student/feelingsStudentPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('Feelings Component', () => {
  const feelings = `${process.env.REACT_APP_BACKEND_URL}/student/feelings`

  const dataResp = [
    {
      date: '2024-03-30',
      content: "Je me sens pas bien aujourd'hui",
      feeling: 0,
      isAnonymous: true,
      reviewDate: '',
      _id: '0'
    },
    {
      date: '2024-03-20',
      content: "J'ai la forme",
      feeling: 4,
      isAnonymous: false,
      reviewDate: '2024-03-22',
      _id: '1'
    }
  ]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(feelings, dataResp)
    fetchMock.post(feelings, [])
    fetchMock.patch(feelings, [])
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FeelingsStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const ressentiBtn = screen.getByText('Créer un ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn)
    })
    expect(screen.getByText('Mon humeur')).toBeInTheDocument()
  })

  it('selects emotion on click', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FeelingsStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const ressentiBtn = screen.getAllByText('Créer un ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn[0])
    })

    const joyButton = screen.getByTitle('Bonne Humeur')
    await act(async () => {
      fireEvent.click(joyButton)
    })

    const messageInput = screen.getByPlaceholderText('Message...')

    await act(async () => {
      fireEvent.change(messageInput, { target: { value: 'Feeling test' } })
    })

    const createFeeling = screen.getAllByText('Créer un ressenti')

    await act(async () => {
      fireEvent.click(createFeeling[1])
    })

    await waitFor(() => {
      const textResult = screen.getByText('Feeling test')
      expect(textResult).toBeInTheDocument()
    })
  })

  it('updates writtenFeeling on textarea change', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FeelingsStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const ressentiBtn = screen.getByText('Créer un ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn)
    })

    const textarea = screen.getByPlaceholderText('Message...') // Use 'feelingText' as the argument
    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'Feeling test' } })
    })

    expect(textarea).toHaveValue('Feeling test')
  })

  it('toggles isAnonymous on checkbox change', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FeelingsStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const ressentiBtn = screen.getByText('Créer un ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn)
    })

    const checkbox = screen.getByLabelText('Anonyme')

    await act(async () => {
      await fireEvent.click(checkbox)
    })
  })

  it('creates two new feelings', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FeelingsStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const ressentiBtn = screen.getAllByText('Créer un ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn[0])
    })

    const joyButton = screen.getByTitle('Bonne Humeur')
    await act(async () => {
      fireEvent.click(joyButton)
    })

    const messageInput = screen.getByPlaceholderText('Message...')

    await act(async () => {
      fireEvent.change(messageInput, { target: { value: 'Feeling test' } })
    })

    const createFeeling = screen.getAllByText('Créer un ressenti')

    await act(async () => {
      fireEvent.click(createFeeling[1])
    })

    await waitFor(() => {
      const textResult = screen.getByText('Feeling test')
      expect(textResult).toBeInTheDocument()
    })

    const ressentiBtn2 = screen.getAllByText('Créer un ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn2[0])
    })

    const joyButton2 = screen.getByTitle('Mauvaise Humeur')
    await act(async () => {
      fireEvent.click(joyButton2)
    })

    const messageInput2 = screen.getByPlaceholderText('Message...')

    await act(async () => {
      fireEvent.change(messageInput2, { target: { value: 'Feeling test2' } })
    })

    const createFeeling2 = screen.getAllByText('Créer un ressenti')

    await act(async () => {
      fireEvent.click(createFeeling2[1])
    })

    await waitFor(() => {
      const textResult = screen.getByText('Feeling test2')
      expect(textResult).toBeInTheDocument()
    })
  })

  it('modify latest feeling', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FeelingsStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const modifBtn = screen.getByText('Modifier le dernier ressenti')

    await act(async () => {
      fireEvent.click(modifBtn)
    })

    const message = screen.getByPlaceholderText('Message...')

    await act(async () => {
      fireEvent.change(message, { target: { value: 'Feeling test2' } })
    })

    const modifBtn2 = screen.getByText('Modifier le ressenti')

    await act(async () => {
      fireEvent.click(modifBtn2)
    })
  })
})
