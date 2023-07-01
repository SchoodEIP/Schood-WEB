import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, act } from '@testing-library/react'
import StudentHomePage from '../../../Users/Student/dashboardStudent'
import { BrowserRouter } from 'react-router-dom'

describe('Dashboard Student component', () => {
  let getByText
  it('should render sections', async () => {
    await act(async () => {
      const { getByText: getByTextFn } = render(<BrowserRouter><StudentHomePage /></BrowserRouter>)
      getByText = getByTextFn
    })

    expect(getByText('Mes Dernières Alertes')).toBeInTheDocument()
    expect(getByText("Evolution semestrielle de l'humeur de mon établissement")).toBeInTheDocument()
    expect(getByText('Mes Questionnaires')).toBeInTheDocument()
  })
})
