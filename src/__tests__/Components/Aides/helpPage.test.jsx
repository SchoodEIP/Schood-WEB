import React from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import HelpPage from '../../../Users/Shared/helpPage'
import { MemoryRouter } from 'react-router-dom'

test('renders HelpPage component', async () => {
  await act(async () => {
    render(
      <MemoryRouter> {}
        <HelpPage />
      </MemoryRouter>
    )
  })
})
