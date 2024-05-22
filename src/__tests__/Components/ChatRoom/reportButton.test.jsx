import React from 'react'
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/'
import ReportButton from '../../../Components/ChatRoom/reportButton'
import fetchMock from 'fetch-mock'
import { BrowserRouter } from 'react-router-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn()
}))

describe('ReportButton Component', () => {
  const dailyMood = `${process.env.REACT_APP_BACKEND_URL}/shared/report`

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.post(dailyMood, { })
    localStorage.setItem('id', '123')
    fetchMock.config.overwriteRoutes = true
  })

  afterEach(() => {
    localStorage.removeItem('id')
    fetchMock.restore()
  })

  it('renders the report button initially', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportButton currentConversation={{ _id: 'conversationId', participants: [{ _id: '123', name: 'Joe' }, { _id: '132', name: 'Jim' }] }} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const reportButton = screen.getByText('Confirmer le signalement')
    await waitFor(async () => {
      expect(reportButton).toBeInTheDocument()
    })
  })

  it('tests with no participants', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportButton currentConversation={null} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
  })

  it('disconnects on post dailymood', async () => {
    fetchMock.post(dailyMood, 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportButton currentConversation={{ _id: 'conversationId', participants: [{ _id: '123', name: 'Joe' }, { _id: '132', name: 'Jim' }] }} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const confirmButton = screen.getByText('Confirmer le signalement')

    await act(async () => {
      fireEvent.click(confirmButton)
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled()
    })
  })

  it('handles successful reporting', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 200 }))
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportButton currentConversation={{ _id: 'conversationId', participants: [{ _id: '123', name: 'Joe' }, { _id: '132', name: 'Jim' }] }} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const reasonSelect = screen.getByDisplayValue('Sélectionnez une raison')
    await act(async () => {
      fireEvent.change(reasonSelect, { target: { value: 'Spam' } })
    })

    const memberSelect = screen.getByDisplayValue('Sélectionnez un des membres de la conversation')
    await act(async () => {
      fireEvent.change(memberSelect, { target: { value: '132' } })
    })

    const description = screen.getByPlaceholderText('Veuillez expliquer votre raison ici.')
    await act(async () => {
      fireEvent.change(description, { target: { value: 'blah' } })
    })

    const confirmButton = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    // expect(global.fetch).toHaveBeenCalledWith(
    //   `${process.env.REACT_APP_BACKEND_URL}/share/report`,
    //   expect.objectContaining({
    //     method: 'POST',
    //     body: expect.stringMatching(/conversationId/i) && expect.stringMatching(/Spam/i)
    //   })
    // )
  })

  it('handles server error', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 500 }))

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportButton currentConversation={{ _id: 'conversationId', participants: [{ _id: '123', name: 'Joe' }, { _id: '132', name: 'Jim' }] }} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const reasonSelect = screen.getByDisplayValue('Sélectionnez une raison')
    await act(async () => {
      fireEvent.change(reasonSelect, { target: { value: 'Spam' } })
    })

    const confirmButton = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    const errorMessage = screen.getByText('Erreur lors du signalement de la conversation.')
    await waitFor(async () => { expect(errorMessage).toBeInTheDocument() })

    const memberSelect = screen.getByDisplayValue('Sélectionnez un des membres de la conversation')
    await act(async () => {
      fireEvent.change(memberSelect, { target: { value: '132' } })
    })

    const confirmBtn2 = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(confirmBtn2)
    })
  })

  it('handles network error', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')))

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportButton currentConversation={{ _id: 'conversationId', participants: [{ _id: '123', name: 'Joe' }, { _id: '132', name: 'Jim' }] }} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const reportButton = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(reportButton)
    })

    const reasonSelect = screen.getByDisplayValue('Sélectionnez une raison')
    await act(async () => {
      fireEvent.change(reasonSelect, { target: { value: 'Spam' } })
    })

    const confirmButton = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    const errorMessage = screen.getByText('Erreur lors du signalement de la conversation.')
    await waitFor(async () => { expect(errorMessage).toBeInTheDocument() })
  })

  it('handles reason selection and confirmation', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 200 }))

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportButton currentConversation={{ _id: 'conversationId', participants: [{ _id: '123', name: 'Joe' }, { _id: '132', name: 'Jim' }] }} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const reportButton = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(reportButton)
    })

    const reasonSelect = screen.getByDisplayValue('Sélectionnez une raison')
    await act(async () => {
      fireEvent.change(reasonSelect, { target: { value: 'Spam' } })
    })

    const confirmButton = screen.getByText('Confirmer le signalement')
    await act(async () => {
      fireEvent.click(confirmButton)
    })

    // expect(global.fetch).toHaveBeenCalledWith(
    //   `${process.env.REACT_APP_BACKEND_URL}/share/report`,
    //   expect.objectContaining({
    //     method: 'POST',
    //     body: expect.stringMatching(/conversationId/i) && expect.stringMatching(/Spam/i)
    //   })
    // )
  })
})
