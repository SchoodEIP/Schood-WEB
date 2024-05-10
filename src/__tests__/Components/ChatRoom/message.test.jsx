import React from 'react'
import { render, screen, act } from '@testing-library/react'
import Message from '../../../Components/ChatRoom/message'
import '@testing-library/jest-dom/'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    ok: true
  })
)

describe('Message Component', () => {
  const participants = [
    {
      _id: '0',
      email: 'teacher1@schood.fr',
      firstname: 'teacher1',
      lastname: 'teacher1'
    },
    {
      _id: '1',
      email: 'teacher2@schood.fr',
      firstname: 'teacher2',
      lastname: 'teacher2'
    }
  ]

  it('renders without crashing', async () => {
    const userMessage = {
      content: 'This is the content of the message',
      user: '0',
      contentType: 'text'
    }
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Message message={userMessage} participants={participants} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
  })

  it('renders a text message', async () => {
    const textMessage = {
      user: '0',
      content: 'Hello, World!',
      contentType: 'text'
    }

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Message message={textMessage} participants={participants} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const contentElement = screen.getByText('Hello, World!')
    expect(contentElement).toBeInTheDocument()

    const userElement = screen.getByText('M. teacher1')
    expect(userElement).toBeInTheDocument()
  })

  it('renders a file message with image', async () => {
    const fileMessage = {
      content: 'File: Image.jpg',
      user: '0',
      contentType: 'file',
      file: '12345' // Replace with a valid file ID
    }

    // Mock the fetch function to resolve with a URL
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        url: 'https://example.com/image.jpg'
      })
    )

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Message message={fileMessage} participants={participants} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const contentElement = screen.getByText('File: Image.jpg')
    expect(contentElement).toBeInTheDocument()
  })

  it('handles fetch error', async () => {
    const fileMessage = {
      content: 'File: Image.jpg',
      user: '0',
      date: '0000',
      contentType: 'file',
      file: '12345'
    }

    // Mock the fetch function to reject with an error
    global.fetch = jest.fn(() => Promise.reject(new Error('Fetch error')))

    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Message message={fileMessage} participants={participants} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const dateElement = screen.getByText('01/01/00 00:00')
    expect(dateElement).toBeInTheDocument()

    // Wait for the error message to appear

    const contentElement = screen.getByText('File: Image.jpg')
    expect(contentElement).toBeInTheDocument()
  })

  // Add more tests for receiving message, sending/receiving files, etc.
})
