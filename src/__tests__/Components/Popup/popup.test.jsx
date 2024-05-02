import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import Popup from '../../../Components/Popup/popup'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('Popup', () => {
  const mockToggle = jest.fn()
  const mockAccountCreation = jest.fn()

  const mockProps = {
    handleClose: mockToggle,
    title: 'Test Popup',
    content: <div>Test Content</div>,
    errMessage: 'Test Error Message',
    btn_text: 'Submit',
    handleCreation: mockAccountCreation
  }

  test('renders popup with correct content and handles actions', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <Popup {...mockProps} />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const closeButton = screen.getByText('x')
    const title = screen.getByText('Test Popup')
    const content = screen.getByText('Test Content')
    const errorMessage = screen.getByText('Test Error Message')
    const submitButton = screen.getByText('Submit')

    fireEvent.click(closeButton)
    expect(mockToggle).toHaveBeenCalled()

    fireEvent.click(submitButton)
    expect(mockAccountCreation).toHaveBeenCalled()

    expect(closeButton).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    expect(content).toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })
})
