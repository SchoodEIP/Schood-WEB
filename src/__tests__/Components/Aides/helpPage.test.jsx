import React from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import HelpPage from '../../../Users/Shared/helpPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

test('renders HelpPage component', async () => {
  await act(async () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <HelpPage />
        </WebsocketProvider>
      </BrowserRouter>
    )
  })
})
