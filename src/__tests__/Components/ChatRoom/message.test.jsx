import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import Messages from '../../../Components/ChatRoom/message'

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    ok: true
  })
)

describe('Messages Component', () => {
  it('renders without crashing', () => {
    render(<Messages />)
  })

  it('displays a list of conversations', async () => {
    // Mock the fetch function to return a list of conversations
    global.fetch.mockReturnValueOnce(
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { _id: '1', name: 'Conversation 1' },
            { _id: '2', name: 'Conversation 2' }
          ]),
        ok: true
      })
    )

    render(<Messages />)

    // Wait for the component to fetch conversations
    await screen.findByText('Conversation 1')
    await screen.findByText('Conversation 2')

    expect(screen.getByText('Conversation 1')).toBeInTheDocument()
    expect(screen.getByText('Conversation 2')).toBeInTheDocument()
  })

  it('sends a message', async () => {
    render(<Messages />)
    const input = screen.getByPlaceholderText('Composez votre message')

    // Type a message in the input field
    fireEvent.change(input, { target: { value: 'Hello, world!' } })

    // Click the "Envoyer" button to send the message
    fireEvent.click(screen.getByText('Envoyer'))
  })

  // Add more tests for receiving messages, sending/receiving files, etc.
})
