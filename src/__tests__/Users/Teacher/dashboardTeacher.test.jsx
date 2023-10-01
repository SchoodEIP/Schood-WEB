import '@testing-library/jest-dom'
import React from 'react'
import { render, act } from '@testing-library/react'
import TeacherHomePage from '../../../Users/Teacher/dashboardTeacher'
import { BrowserRouter } from 'react-router-dom'

describe('Dashboard Teachercomponent', () => {
  it('should render sections', async () => {
    let getByText

    await act(async () => {
      const { getByText: getByTextFn } = render(<BrowserRouter><TeacherHomePage /></BrowserRouter>)
      getByText = getByTextFn
    })

    expect(getByText('Mes Dernières Alertes')).toBeInTheDocument()
    expect(getByText("Evolution semestrielle de l'humeur de mon établissement")).toBeInTheDocument()
    expect(getByText('Mes Questionnaires')).toBeInTheDocument()
  })
})
