import React from 'react'
import { QuestSpace } from '../../../Components/Questionnaire/questSpace.jsx'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('QuestSpace Component', () => {
  const statusLastTwo = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/statusLastTwo/`
  const questionnaires = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/`

  const questionnairesResult = [
    {
      classes: [
        {
          name: "200",
          __v: 0,
          _id: "65e0e4477c0cc03bd4999ebd"
        },
        {
          name: "201",
          __v: 0,
          _id: "65e0e4477c0cc03bd4999ebf"
        }
      ],
      facility: "65e0e4477c0cc03bd4999eb7",
      fromDate: "2024-02-19T00:00:00.000Z",
      title: "Questionnaire Français",
      toDate: "2024-02-25T00:00:00.000Z",
      _id: "id1"
    },
    {
      classes: [
        {
          name: "200",
          __v: 0,
          _id: "65e0e4477c0cc03bd4999ebd"
        }
      ],
      facility: "65e0e4477c0cc03bd4999eb7",
      fromDate: "2024-02-26T00:00:00.000Z",
      title: "Questionnaire Mathématique",
      toDate: "2024-03-03T00:00:00.000Z",
      _id: "id2"
    }
  ];

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(statusLastTwo, { q1: 100, q2: 50 })
    fetchMock.get(questionnaires, questionnairesResult)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('shows the component QuestSpace', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <QuestSpace />
        </MemoryRouter>
      )
    })
    const questSpaceElement = screen.getByTestId('quest-space') // Utilisation de getByTestId
    expect(questSpaceElement).toBeInTheDocument()
  })

  it('shows the title of Mes Questionnaires', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <QuestSpace />
        </MemoryRouter>
      )
    })
    const titleElement = screen.getByText('Mes Questionnaires')
    expect(titleElement).toBeInTheDocument()
  })

  it('tests catch error', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })

    await act(async () => {
      render(
        <MemoryRouter>
          <QuestSpace />
        </MemoryRouter>
      )
    })
    const titleElement = screen.getByText('Mes Questionnaires')
    expect(titleElement).toBeInTheDocument()
  })

  it('goes to the form', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <QuestSpace />
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      const previousformStatus = screen.queryByText('Ce questionnaire n\'a pas été terminé à temps.')
      expect(previousformStatus).toBeInTheDocument()
    })

    await waitFor(() => {
      const currentformStatus = screen.queryByText('Ce questionnaire a été complété.')
      expect(currentformStatus).toBeInTheDocument()
    })
  })
})
