import React from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChatPage from '../../../Users/Shared/chatRoomPage.jsx'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

test('renders chatRoomPage component', async () => {
  await act(async () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <ChatPage />
        </WebsocketProvider>
      </BrowserRouter>
    )
  })
})
