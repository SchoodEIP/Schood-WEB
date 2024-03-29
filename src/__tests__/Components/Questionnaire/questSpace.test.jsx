import React from 'react'
import { QuestSpace } from '../../../Components/Questionnaire/questSpace.jsx'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('QuestSpace Component', () => {
  const previousUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/previous`
  const currentUrl = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/current`

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(previousUrl, { body: { status: 'completed' } })
    fetchMock.get(currentUrl, { body: { status: 'in_progress' } })
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

  it('shows the tile of Mes Questionnaires', async () => {
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
      const previousformStatus = screen.queryByText('Ce questionnaire est fini.')
      expect(previousformStatus).toBeInTheDocument()
    })

    await waitFor(() => {
      const currentformStatus = screen.queryByText('Ce questionnaire a été commencé.')
      expect(currentformStatus).toBeInTheDocument()
    })
  })
})
