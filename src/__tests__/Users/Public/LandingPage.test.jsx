import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LandingPage from '../../../Users/Public/LandingPage'

describe('LandingPage', () => {
  test('should render text content', () => {
    render(<LandingPage />)
    const whatQuestion = screen.getByText("C'est quoi Schood ?")
    const whatAnswer = screen.getByText("C'est un collecteur de ressentis en milieu scolaire.")
    expect(whatQuestion).toBeInTheDocument()
    expect(whatAnswer).toBeInTheDocument()
  })
})
