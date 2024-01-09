import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import StudentHomePage from '../../../Users/Student/dashboardStudent'
import { MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('Last Alert component', () => {
  const previousUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/previous`
  const currentUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/current`
  const dailyMood = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/dailyMood`
  const lastAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/`
  const getFile = `${process.env.REACT_APP_BACKEND_URL}/user/file/math_file`

  const alertList = [
    {
      title: 'Première Alerte',
      message: 'Ceci est la première alerte',
      classes: [],
      role: [],
      createdAt: '2023',
      createdBy: '0921',
      file: '',
      _id: "123"
    },
    {
      title: 'Mr Math',
      message: 'Des contacts pour le soutien scolaire se trouvent dans la partie aide',
      classes: [],
      role: [],
      createdAt: '2023',
      createdBy: '0921',
      file: 'math_file',
      _id: "132"
    }
  ]

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(previousUrl, { body: { status: 'not_started' } })
    fetchMock.get(currentUrl, { body: { status: 'in_progress' } })
    fetchMock.get(dailyMood, { moodStatus: true, mood: 'Heureux' })
    fetchMock.post(dailyMood, { })
    fetchMock.get(lastAlert, { body: alertList })
    fetchMock.get(getFile, { body: 'pdf_link' })
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('should render the homepage', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <StudentHomePage />
        </MemoryRouter>
      )
    })
    await waitFor(() => {
      expect(screen.getByText('Mes Dernières Alertes')).toBeInTheDocument()
    })
    const downloadBtn = screen.getByText('Télécharger le fichier')
    await waitFor(() => {
      expect(downloadBtn).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(downloadBtn)
    })
  })

  it('should handle errors', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })
    await act(async () => {
      render(
        <MemoryRouter>
          <StudentHomePage />
        </MemoryRouter>
      )
    })
    expect(screen.getByText('Mes Questionnaires')).toBeInTheDocument()
    const downloadBtn = screen.queryByText('Télécharger le fichier')
    await waitFor(() => {
      expect(downloadBtn).not.toBeInTheDocument()
    })
  })
})
