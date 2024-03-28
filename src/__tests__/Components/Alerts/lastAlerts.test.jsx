import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import StudentHomePage from '../../../Users/Student/dashboardStudent'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('Last Alert component', () => {
  const statusLastTwo = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/statusLastTwo/`
  const questionnaires = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/`
  const dailyMood = `${process.env.REACT_APP_BACKEND_URL}/student/dailyMood`
  const lastAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/`
  const getFile = `${process.env.REACT_APP_BACKEND_URL}/user/file/132`

  const questionnairesResult = [
    {
      classes: [
        {
          name: '200',
          __v: 0,
          _id: '65e0e4477c0cc03bd4999ebd'
        },
        {
          name: '201',
          __v: 0,
          _id: '65e0e4477c0cc03bd4999ebf'
        }
      ],
      facility: '65e0e4477c0cc03bd4999eb7',
      fromDate: '2024-02-19T00:00:00.000Z',
      title: 'Questionnaire Français',
      toDate: '2024-02-25T00:00:00.000Z',
      _id: 'id1'
    },
    {
      classes: [
        {
          name: '200',
          __v: 0,
          _id: '65e0e4477c0cc03bd4999ebd'
        }
      ],
      facility: '65e0e4477c0cc03bd4999eb7',
      fromDate: '2024-02-26T00:00:00.000Z',
      title: 'Questionnaire Mathématique',
      toDate: '2024-03-03T00:00:00.000Z',
      _id: 'id2'
    }
  ]

  const statusTwoResult = {
    q1: 100,
    q2: 50
  }

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
    fetchMock.get(statusLastTwo, statusTwoResult)
    fetchMock.get(questionnaires, questionnairesResult)
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
        <BrowserRouter>
          <WebsocketProvider>
          <StudentHomePage />
          </WebsocketProvider>
        </BrowserRouter>
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
        <BrowserRouter>
          <WebsocketProvider>
            <StudentHomePage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    expect(screen.getByText('Mes Questionnaires')).toBeInTheDocument()
    const downloadBtn = screen.queryByText('Télécharger le fichier')
    await waitFor(() => {
      expect(downloadBtn).not.toBeInTheDocument()
    })
  })
})
