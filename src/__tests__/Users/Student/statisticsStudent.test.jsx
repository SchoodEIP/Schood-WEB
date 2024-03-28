import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import StudentStatPage from '../../../Users/Student/statisticsStudent'
import { WebsocketProvider } from '../../../contexts/websocket'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../../../Components/Header/headerComp', () => () => <div data-testid='header-comp' />)
jest.mock('../../../Components/Sidebar/sidebar', () => () => <div data-testid='sidebar' />)

describe('StudentStatPage Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/statistiques']}>
        <WebsocketProvider>
          <StudentStatPage />
        </WebsocketProvider>
      </MemoryRouter>
    )
  })

  it('renders HeaderComp', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/statistiques']}>
        <WebsocketProvider>
          <StudentStatPage />
        </WebsocketProvider>
      </MemoryRouter>
    )
    const headerComp = getByTestId('header-comp')
    expect(headerComp).toBeInTheDocument()
  })

  it('renders Sidebar', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/statistiques']}>
        <WebsocketProvider>
          <StudentStatPage />
        </WebsocketProvider>
      </MemoryRouter>
    )
    const sidebar = getByTestId('sidebar')
    expect(sidebar).toBeInTheDocument()
  })
})
