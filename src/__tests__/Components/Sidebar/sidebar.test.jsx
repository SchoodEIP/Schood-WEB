import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import Sidebar from '../../../Components/Sidebar/sidebar'
import { fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
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

it('renders sidebar with expanded state', () => {
  act(() => {
    root.render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )
  })

  const sidebarToggle = container.querySelector('.sidebar-toggle')
  act(() => {
    // click to change the state of the sidebar
    fireEvent.click(sidebarToggle)
  })

  // Check if the sidebar is rendered with the expanded state
  const sidebarContainer = container.querySelector('.sidebar-container')
  expect(sidebarContainer.classList.contains('expanded')).toBe(true)

  // Check if icons are visible
  const sidebarIcons = container.querySelectorAll('.sidebar-menu-item-icon')
  expect(sidebarIcons.length).toBeGreaterThan(0)

  // Check if names are visible
  const sidebarLabels = container.querySelectorAll('.sidebar-menu-item-label')
  expect(sidebarLabels.length).toBeGreaterThan(0)
})

it('renders sidebar with expanded state', () => {
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
