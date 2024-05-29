import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import HeaderComp from '../../../Components/Header/headerComp'

describe('HeaderComp', () => {
  test('should render logo', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <HeaderComp />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    const logo = screen.getByAltText('Schood')
    expect(logo).toBeInTheDocument()
  })

  // test('should empty localStorage and sessionStorage', async () => {
  //   await act(async () => {
  //     render(
  //       <BrowserRouter>
  //         <WebsocketProvider>
  //           <HeaderComp />
  //         </WebsocketProvider>
  //       </BrowserRouter>
  //     )
  //   })
  //   const logout = screen.getByTestId('logout-button')
  //   expect(logout.tagName).toBe('A')

  //   window.localStorage.setItem('token', 'falseToken')
  //   window.localStorage.setItem('role', 'admin')
  //   window.sessionStorage.setItem('token', 'falseToken')
  //   window.sessionStorage.setItem('role', 'admin')
  //   expect(window.localStorage.getItem('token')).toBe('falseToken')
  //   expect(window.localStorage.getItem('role')).toBe('admin')
  //   expect(window.sessionStorage.getItem('token')).toBe('falseToken')
  //   expect(window.sessionStorage.getItem('role')).toBe('admin')

  //   fireEvent.click(screen.getByTestId('logout-button'))

  //   expect(window.localStorage.getItem('token')).toBe(null)
  //   expect(window.localStorage.getItem('role')).toBe(null)
  //   expect(window.sessionStorage.getItem('token')).toBe(null)
  //   expect(window.sessionStorage.getItem('role')).toBe(null)
  // })
})
