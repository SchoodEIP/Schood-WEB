import React from 'react'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import FeelingsStudentPage from '../../../Users/Student/feelingsStudentPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/sharedFunctions'

jest.mock('../../../functions/sharedFunctions', () => ({
  disconnect: jest.fn(),
}));

describe('Feelings Component', () => {
  const feelings = `${process.env.REACT_APP_BACKEND_URL}/student/mood`

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
    fetchMock.config.overwriteRoutes = true
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

    const ressentiBtn = screen.getByText('Créer un Ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn)
    })
    expect(screen.getByText('Mon humeur')).toBeInTheDocument()
  })

  test('checks disconnect through get feelings url', async () => {
    fetchMock.get(feelings, 401)

    await act(async () => {
      render(
        <BrowserRouter >
          <WebsocketProvider>
            <FeelingsStudentPage/>
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  test('checks disconnect through post feelings url', async () => {
    fetchMock.post(feelings, 401)

    await act(async () => {
      render(
        <BrowserRouter >
          <WebsocketProvider>
            <FeelingsStudentPage/>
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const ressentiBtn = screen.getByText('Créer un Ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn)
    })

    const joyButton = screen.getByTitle('Bonne Humeur')
    await act(async () => {
      fireEvent.click(joyButton)
    })

    const messageInput = screen.getByPlaceholderText('Message...')

    await act(async () => {
      fireEvent.change(messageInput, { target: { value: 'Feeling test' } })
    })

    const createFeeling = screen.getByText('Créer le Ressenti')

    await act(async () => {
      fireEvent.click(createFeeling)
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  test('checks disconnect through patch feelings url', async () => {
    fetchMock.patch(feelings, 401)

    await act(async () => {
      render(
        <BrowserRouter >
          <WebsocketProvider>
            <FeelingsStudentPage/>
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const ressentiBtn = screen.getByText('Modifier le Dernier Ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn)
    })

    const joyButton = screen.getByTitle('Bonne Humeur')
    await act(async () => {
      fireEvent.click(joyButton)
    })

    const messageInput = screen.getByPlaceholderText('Message...')

    await act(async () => {
      fireEvent.change(messageInput, { target: { value: 'Feeling test' } })
    })

    const createFeeling = screen.getByText('Modifier le Ressenti')

    await act(async () => {
      fireEvent.click(createFeeling)
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  test('checks no mood', async () => {

    await act(async () => {
      render(
        <BrowserRouter >
          <WebsocketProvider>
            <FeelingsStudentPage/>
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const ressentiBtn = screen.getByText('Créer un Ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn)
    })

    const createFeeling = screen.getByText('Créer le Ressenti')

    await act(async () => {
      fireEvent.click(createFeeling)
    })

    await waitFor(() => {
      expect(screen.getByText('L\'humeur n\'est pas indiquée.')).toBeInTheDocument()
    })
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
    const ressentiBtn = screen.getByText('Créer un Ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn)
    })

    const joyButton = screen.getByTitle('Très Bonne Humeur')
    await act(async () => {
      fireEvent.click(joyButton)
    })

    await act(async () => {
      fireEvent.click(screen.getByTitle('Bonne Humeur'))
    })

    await act(async () => {
      fireEvent.click(screen.getByTitle('Humeur Neutre'))
    })

    await act(async () => {
      fireEvent.click(screen.getByTitle('Mauvaise Humeur'))
    })

    await act(async () => {
      fireEvent.click(screen.getByTitle('Très Mauvaise Humeur'))
    })

    const messageInput = screen.getByPlaceholderText('Message...')

    await act(async () => {
      fireEvent.change(messageInput, { target: { value: 'Feeling test' } })
    })

    const createFeeling = screen.getByText('Créer le Ressenti')

    await act(async () => {
      fireEvent.click(createFeeling)
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

    const ressentiBtn = screen.getByText('Créer un Ressenti')

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
    const ressentiBtn = screen.getByText('Créer un Ressenti')

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
    const ressentiBtn = screen.getByText('Créer un Ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn)
    })

    const joyButton = screen.getByTitle('Bonne Humeur')
    await act(async () => {
      fireEvent.click(joyButton)
    })

    const messageInput = screen.getByPlaceholderText('Message...')

    await act(async () => {
      fireEvent.change(messageInput, { target: { value: 'Feeling test' } })
    })

    const createFeeling = screen.getByText('Créer le Ressenti')

    await act(async () => {
      fireEvent.click(createFeeling)
    })

    const ressentiBtn2 = screen.getByText('Créer un Ressenti')

    await act(async () => {
      fireEvent.click(ressentiBtn2)
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

    const modifBtn = screen.getByText('Modifier le Dernier Ressenti')

    await act(async () => {
      fireEvent.click(modifBtn)
    })

    const message = screen.getByPlaceholderText('Message...')

    await act(async () => {
      fireEvent.change(message, { target: { value: 'Feeling test2' } })
    })

    const modifBtn2 = screen.getByText('Modifier le Ressenti')

    await act(async () => {
      fireEvent.click(modifBtn2)
    })
  })
})
