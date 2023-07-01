import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import NoPage from '../../../Users/Public/NoPage'

describe('NoPage', () => {
  test('should render error message', () => {
    render(<NoPage />)
    const error = screen.getByText('Error 404')
    const message = screen.getByText('This page does not exist.')
    expect(error).toBeInTheDocument()
    expect(message).toBeInTheDocument()
  })
})
