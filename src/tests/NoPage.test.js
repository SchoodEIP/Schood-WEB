import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import NoPage from '../Users/Public/NoPage'

describe('HeaderComp', () => {
  test('should render logo and user icon', () => {
    render(<NoPage />)
    const error = screen.getByText('Error 404')
    const message = screen.getByText('This page does not exist.')
    expect(error).toBeInTheDocument()
    expect(message).toBeInTheDocument()
  })
})
