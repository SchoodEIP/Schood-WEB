import { render, screen, fireEvent } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import PreviousPage from '../../../Components/Buttons/previousPage'

describe('PreviousPage', () => {
  it('Renders the About component', () => {
    const history = createMemoryHistory()
    history.push('/previous-page')

    render(
      <BrowserRouter>
        <PreviousPage />
      </BrowserRouter>
    )

    fireEvent.click(screen.getByText('Back'))

    expect(history.location.pathname).toBe('/previous-page')
  })
})
