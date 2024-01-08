import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import TeacherStatPage from '../../../Users/Teacher/statisticsTeacher'

jest.mock('../../../Components/Header/headerComp', () => () => <div data-testid='header-comp' />)
jest.mock('../../../Components/Sidebar/sidebar', () => () => <div data-testid='sidebar' />)

describe('TeacherStatPage Component', () => {
  it('renders without crashing', () => {
    render(<TeacherStatPage />)
  })

  it('renders HeaderComp', () => {
    const { getByTestId } = render(<TeacherStatPage />)
    const headerComp = getByTestId('header-comp')
    expect(headerComp).toBeInTheDocument()
  })

  it('renders Sidebar', () => {
    const { getByTestId } = render(<TeacherStatPage />)
    const sidebar = getByTestId('sidebar')
    expect(sidebar).toBeInTheDocument()
  })
})
