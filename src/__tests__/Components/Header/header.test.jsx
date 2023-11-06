import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import HeaderComp from '../../../Components/Header/headerComp'
import { MemoryRouter } from 'react-router-dom'

describe('HeaderComp', () => {
  test('should render logo and user icon', () => {
    render(<HeaderComp />)
    const logo = screen.getByAltText('logo')
    expect(logo).toBeInTheDocument()
  })

  test('should redirect to home page', async () => {
    render(
      <MemoryRouter>
        <HeaderComp />
      </MemoryRouter>
    )
    const menu = screen.getByTestId('menu-button')

    fireEvent.click(menu)

    expect(window.location.pathname).toBe('/');
  })
})
