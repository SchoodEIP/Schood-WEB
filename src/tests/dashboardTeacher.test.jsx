import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, act } from '@testing-library/react'
import axios from 'axios'
import TeacherHomePage from '../Users/Teacher/dashboardTeacher'
import { BrowserRouter } from 'react-router-dom'

jest.mock('axios')

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
