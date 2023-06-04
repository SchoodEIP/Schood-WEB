import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'
import { act, screen } from 'react-dom/test-utils'
import Sidebar from '../Components/Sidebar/Sidebar'
import { fireEvent, getAllByLabelText } from '@testing-library/react'
import '@testing-library/jest-dom'
let container = null

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

it('renders sidebar with collapsed state', () => {
  act(() => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>,
      container
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
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>,
      container
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
  window.sessionStorage.setItem('role', 'student');
  act(() => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>,
      container
    )
  })
  expect(container.querySelectorAll('#questionnaire'))
  window.sessionStorage.removeItem('role');
})