import React from 'react'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import HelpPage from '../../../Users/Shared/helpPage'
import { MemoryRouter } from 'react-router-dom'

test('renders HelpPage component', async () => {
  await act(async () => {
    render(
      <MemoryRouter> {/* Enveloppez votre composant dans MemoryRouter */}
        <HelpPage />
      </MemoryRouter>
    )
  })
  // Vous pouvez ajouter d'autres assertions en fonction de votre code
})
