import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import Sidebar from '../../../Components/Sidebar/sidebar'
import { fireEvent, screen, render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'


describe('Sidebar', () => {
  let container = null
  let root = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    root = createRoot(container)
  })

  afterEach(() => {
    container.remove()
    container = null
    act(() => {
      root.unmount()
      root = null
    })
  })

  it('renders sidebar with collapsed state', () => {
    act(() => {
      root.render(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      )
    })

    const sidebarContainer = container.querySelector('.sidebar-container')
    expect(sidebarContainer.classList.contains('collapsed')).toBe(true)

    const sidebarIcons = container.querySelectorAll('.sidebar-menu-item-icon')
    expect(sidebarIcons.length).toBeGreaterThan(0)

    // Check if names are visible
    const sidebarLabels = container.querySelectorAll('.sidebar-menu-item-label')
    expect(sidebarLabels.length).toBe(0)
  })

  it('checks if resize works', async () => {
    act(() => {
      root.render(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      )
    })

    const initialHeight = container.querySelector('.sidebar-container').style.height;

  act(() => {
    window.innerHeight = 500;
    window.dispatchEvent(new Event('resize'));
  });

  const updatedHeight = container.querySelector('.sidebar-container').style.height;

  expect(initialHeight).not.toBe(updatedHeight);
  })

  it('renders sidebar with expanded state', async () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    const sidebarToggle = screen.getByTestId('sidebar-resize')
    expect(sidebarToggle).toBeInTheDocument()

    await act(() => {
      fireEvent.click(sidebarToggle)
    })

    const sidebarContainer = screen.getByTestId('sidebar-container')
    await waitFor(() => {
      expect(sidebarContainer.classList.contains('expanded')).toBe(true)
    })

    const sidebarIcons = screen.getAllByTestId('menu-icon')
    expect(sidebarIcons.length).toBeGreaterThan(0)

    const sidebarLabels = screen.getAllByTestId('sidebar-menu-item-label')
    expect(sidebarLabels.length).toBeGreaterThan(0)
  })

  it('goes to questionnaire', () => {
    window.sessionStorage.setItem('role', 'student')
    act(() => {
      root.render(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      )
    })
    expect(container.querySelectorAll('#questionnaire'))
    window.sessionStorage.removeItem('role')
  })


  test('checks if logout works', async () => {
      render(
        <BrowserRouter>
          <Sidebar />
        </BrowserRouter>
      )

    window.localStorage.setItem('token', 'falseToken')
    window.localStorage.setItem('role', 'admin')
    window.sessionStorage.setItem('token', 'falseToken')
    window.sessionStorage.setItem('role', 'admin')
    expect(window.localStorage.getItem('token')).toBe('falseToken')
    expect(window.localStorage.getItem('role')).toBe('admin')
    expect(window.sessionStorage.getItem('token')).toBe('falseToken')
    expect(window.sessionStorage.getItem('role')).toBe('admin')

    const logout = screen.getByTestId('sidebar-logout')
    await act(() => {
      fireEvent.click(logout)
    })

    await waitFor(() => {
      expect(window.localStorage.getItem('token')).toBe(null)
    })

    await waitFor(() => {
      expect(window.localStorage.getItem('role')).toBe(null)
    })
    await waitFor(() => {

      expect(window.sessionStorage.getItem('token')).toBe(null)
    })

    expect(window.sessionStorage.getItem('role')).toBe(null)
  })
})

