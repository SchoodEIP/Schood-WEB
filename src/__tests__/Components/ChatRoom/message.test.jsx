import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import Messages from '../../../Components/ChatRoom/message'
import '@testing-library/jest-dom/'

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    ok: true
  })
)

describe('Messages Component', () => {
  it('renders without crashing', async () => {
    const userMessage = {
      content: 'This is the content of the message',
      username: 'User',
      contentType: 'text'
    }
    await act(async () => {
      render(<Messages message={userMessage} />)
    })
  })

  it('renders a text message', async () => {
    const textMessage = {
      user: 'User',
      content: 'Hello, World!',
      contentType: 'text'
    }

    await act(async () => {
      render(<Messages message={textMessage} />)
    })

    const contentElement = screen.getByText('Hello, World!')
    expect(contentElement).toBeInTheDocument()

    const userElement = screen.getByText('User')
    expect(userElement).toBeInTheDocument()
  })

  it('renders a file message with image', async () => {
    const fileMessage = {
      content: 'File: Image.jpg',
      username: 'User',
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
      render(<Messages message={fileMessage} />)
    })

    screen.debug()

    // Wait for the image to load

    const contentElement = screen.getByText('File: Image.jpg')
    expect(contentElement).toBeInTheDocument()
  })

  it('handles fetch error', async () => {
    const fileMessage = {
      content: 'File: Image.jpg',
      username: 'User',
      date: '0000',
      contentType: 'file',
      file: '12345'
    }

    // Mock the fetch function to reject with an error
    global.fetch = jest.fn(() => Promise.reject(new Error('Fetch error')))

    await act(async () => {
      render(<Messages message={fileMessage} />)
    })

    const dateElement = screen.getByText('0000')
    expect(dateElement).toBeInTheDocument()

    // Wait for the error message to appear

    const contentElement = screen.getByText('File: Image.jpg')
    expect(contentElement).toBeInTheDocument()
  })

  // Add more tests for receiving messages, sending/receiving files, etc.
})