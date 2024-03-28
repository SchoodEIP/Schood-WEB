import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import StudentStatPage from '../../../Users/Student/statisticsStudent'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'

jest.mock('../../../Components/Header/headerComp', () => () => <div data-testid='header-comp' />)
jest.mock('../../../Components/Sidebar/sidebar', () => () => <div data-testid='sidebar' />)

describe('StudentStatPage Component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <WebsocketProvider>
          <StudentStatPage />
        </WebsocketProvider>
      </BrowserRouter>
    )
  })

  it('renders HeaderComp', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <WebsocketProvider>
          <StudentStatPage />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const headerComp = getByTestId('header-comp')
    expect(headerComp).toBeInTheDocument()
  })

  it('renders Sidebar', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <WebsocketProvider>
          <StudentStatPage />
        </WebsocketProvider>
      </BrowserRouter>
    )
    const sidebar = getByTestId('sidebar')
    expect(sidebar).toBeInTheDocument()
  })
})
