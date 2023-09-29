import React from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react'
import Messages from '../../../Components/ChatRoom/message'

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
  // Add more tests for receiving messages, sending/receiving files, etc.
})
