import React from 'react'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Feelings from '../../../Components/Feelings/feelingsShared'

jest.useFakeTimers()

describe('Feelings Component', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(<Feelings />)
    })
    expect(screen.getByText('Joyeux')).toBeInTheDocument()
  })

  it('selects emotion on click', async () => {
    await act(async () => {
      render(<Feelings />)
    })

    const joyButton = screen.getByText('Joie modérée')
    fireEvent.click(joyButton)

    expect(screen.getByText('Joie modérée').parentElement).toHaveClass('selected-emotion')
  })

  it('updates writtenFeeling on textarea change', async () => {
    await act(async () => {
      render(<Feelings />)
    })

    const textarea = screen.getByTestId('feelingText') // Use 'feelingText' as the argument
    fireEvent.change(textarea, { target: { value: 'Feeling test' } })

    expect(textarea).toHaveValue('Feeling test')
  })

  it('toggles isAnonymous on checkbox change', async () => {
    await act(async () => {
      render(<Feelings />)
    })

    const checkbox = screen.getByTestId('anonymousCheckbox')
    await act(async () => {
      await fireEvent.click(checkbox)
    })
  })

  it('resets form state after popup is closed', async () => {
    global.fetch = jest.fn(() => Promise.resolve({}))

    await act(async () => {
      render(<Feelings />)
    })

    await act(async () => {
      await fireEvent.click(screen.getByTestId('buttonSend'))
    })

    expect(screen.getByText(/Ressenti envoyé avec succès/)).toBeInTheDocument()

    act(() => {
      jest.runAllTimers() // Advance all timers
    })

    await waitFor(() => {
      expect(screen.queryByTestId('popupTest')).not.toBeInTheDocument()
    })

    expect(screen.getByLabelText('Indiquez votre ressenti par écrit:')).toHaveValue('')

    delete global.fetch
  })
})
