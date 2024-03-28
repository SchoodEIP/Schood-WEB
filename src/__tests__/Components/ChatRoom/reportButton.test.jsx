import React from 'react'
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/'
import ReportButton from '../../../Components/ChatRoom/reportButton'
import fetchMock from 'fetch-mock'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('ReportButton Component', () => {
  const dailyMood = `${process.env.REACT_APP_BACKEND_URL}/shared/report`

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.post(dailyMood, { })
    localStorage.setItem('id', '123')
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

    const reportButton = screen.getByText('Signaler')
    await waitFor(async () => {
      expect(reportButton).toBeInTheDocument()
    })
  })

  it('displays the confirmation UI when the report button is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <ReportButton currentConversation={{ _id: 'conversationId', participants: [{ _id: '123', name: 'Joe' }, { _id: '132', name: 'Jim' }] }} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const reportButton = screen.getByText('Signaler')

    await act(async () => {
      fireEvent.click(reportButton)
    })
    const reasonSelect = screen.getByDisplayValue('Sélectionnez une raison')
    const confirmButton = screen.getByText('Confirmer le signalement')
    await waitFor(async () => {
      expect(reasonSelect).toBeInTheDocument()
    })
    await waitFor(async () => {
      expect(confirmButton).toBeInTheDocument()
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

    const reportButton = screen.getByText('Signaler')

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

    const reportButton = screen.getByText('Signaler')
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

    const reportButton = screen.getByText('Signaler')
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
            <ReportButton currentConversation={{ _id: 'conversationId', participants: [{ _id: '123', name: 'Joe' }, { _id: '132', name: 'Jim' }] }} />
        </BrowserRouter>
      )
    })

    const reportButton = screen.getByText('Signaler')
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
