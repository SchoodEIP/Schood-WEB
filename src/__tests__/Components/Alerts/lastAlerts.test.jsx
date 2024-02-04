import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import StudentHomePage from '../../../Users/Student/dashboardStudent'
import { MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('Last Alert component', () => {
  const previousUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/previous`
  const currentUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/current`
  const dailyMood = `${process.env.REACT_APP_BACKEND_URL}/student/dailyMood`
  const lastAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/`
  const getFile = `${process.env.REACT_APP_BACKEND_URL}/user/file/132`

  const alertList = [
    {
      title: 'Première Alerte',
      message: 'Ceci est la première alerte',
      classes: [],
      role: [],
      createdAt: '2023',
      createdBy: '0921',
      file: '',
      _id: '123'
    },
    {
      title: 'Mr Math',
      message: 'Des contacts pour le soutien scolaire se trouvent dans la partie aide',
      classes: [],
      role: [],
      createdAt: '2023',
      createdBy: '0921',
      file: '132',
      _id: '132'
    }
  ]

  const getFileResponse = {
    status: 200,
    headers: {
      'content-length': '7832',
      'content-type': 'image/jpeg'
    },
    type: 'cors',
    redirected: false,
    url: 'https://localhost:8080/user/file/abcd123',
    ok: true,
    statusText: 'OK',
    body: {
      locked: true
    }
  }

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(previousUrl, { body: { status: 'not_started' } })
    fetchMock.get(currentUrl, { body: { status: 'in_progress' } })
    fetchMock.get(dailyMood, { moodStatus: true, mood: 0 })
    fetchMock.post(dailyMood, { })
    fetchMock.get(lastAlert, { body: alertList })
    fetchMock.get(getFile, getFileResponse)
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
  })

  it('should handle errors', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })
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
