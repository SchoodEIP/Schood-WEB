import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import '@testing-library/jest-dom'
import NoPage from '../../../Users/Public/noPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('NoPage', () => {
  test('should render error message', () => {
    const history = createMemoryHistory()
    history.push('/previous-page')

    render(
      <BrowserRouter>
        <WebsocketProvider>
          <NoPage />
        </WebsocketProvider>
      </BrowserRouter>
    )

    const error = screen.getByText('Error 404')
    const message = screen.getByText('This page does not exist.')
    expect(error).toBeInTheDocument()
    expect(message).toBeInTheDocument()

    fireEvent.click(screen.getByText('Back'))

    expect(history.location.pathname).toBe('/previous-page')
  })
})
