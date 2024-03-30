import React from 'react'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import FeelingsStudentPage from '../../../Users/Student/feelingsStudentPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

jest.useFakeTimers()

describe('Feelings Component', () => {
  const feelings = `${process.env.REACT_APP_BACKEND_URL}/student/feelings`

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(feelings, [])
    fetchMock.post(feelings, { status: 200 })
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
    expect(screen.getByText('Bonne Humeur')).toBeInTheDocument()
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
    const ressentiBtn = screen.getByText('Créer un ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn)
    })

    const joyButton = screen.getByText('Bonne Humeur')
    await act(async () => {
      fireEvent.click(joyButton)
    })

    expect(screen.getByText('Bonne Humeur').parentElement).toHaveClass('selected-emotion')
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

    const textarea = screen.getByTestId('feelingText') // Use 'feelingText' as the argument
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

    const checkbox = screen.getByTestId('anonymousCheckbox')

    await act(async () => {
      await fireEvent.click(checkbox)
    })
  })

  it('resets form state after popup is closed', async () => {
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

    await act(async () => {
      await fireEvent.click(screen.getByTestId('buttonSend'))
    })

    await act(() => {
      jest.runAllTimers() // Advance all timers
    })

    await waitFor(() => {
      expect(screen.queryByTestId('popupTest')).not.toBeInTheDocument()
    })

    expect(screen.getByLabelText('Indiquez votre ressenti par écrit:')).toHaveValue('')

    delete global.fetch
  })
})
