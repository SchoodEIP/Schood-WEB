import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LandingPage from '../../../Users/Public/landingPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

describe('LandingPage', () => {
  test('should render text content', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <LandingPage />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const whatQuestion = screen.getByText("C'est quoi Schood ?")
    const whatAnswer = screen.getByText("C'est un collecteur de ressentis en milieu scolaire.")
    expect(whatQuestion).toBeInTheDocument()
    expect(whatAnswer).toBeInTheDocument()
  })
})
