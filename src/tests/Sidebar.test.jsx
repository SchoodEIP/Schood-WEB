import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'
import { act, MouseEvent } from 'react-dom/test-utils'
import Sidebar from '../Components/Sidebar/Sidebar'

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
  render(
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>
  )
  // act(() => {
  //   render(
  //     <BrowserRouter>
  //       <Sidebar />
  //     </BrowserRouter>,
  //   )
  // })

  // Vérifie si la sidebar est rendue avec l'état rétracté
  const sidebarContainer = container.querySelector('.sidebar-container')
  expect(sidebarContainer.classList.contains('collapsed')).toBe(true)

  // Vérifie si les icônes sont visibles
  const sidebarIcons = container.querySelectorAll('.sidebar-menu-item-icon')
  expect(sidebarIcons.length).toBeGreaterThan(0)

  // Vérifie si les noms des onglets ne sont pas visibles
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
    // Clique pour basculer l'état de la sidebar
    sidebarToggle.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  // Vérifie si la sidebar est rendue avec l'état non rétracté
  const sidebarContainer = container.querySelector('.sidebar-container')
  expect(sidebarContainer.classList.contains('expanded')).toBe(true)

  // Vérifie si les icônes sont visibles
  const sidebarIcons = container.querySelectorAll('.sidebar-menu-item-icon')
  expect(sidebarIcons.length).toBeGreaterThan(0)

  // Vérifie si les noms des onglets sont visibles
  const sidebarLabels = container.querySelectorAll('.sidebar-menu-item-label')
  expect(sidebarLabels.length).toBeGreaterThan(0)
})
