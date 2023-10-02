import React from 'react'
import { QuestSpace } from '../../../Components/Questionnaire/questSpace.jsx'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import fetchMock from 'fetch-mock'

describe('QuestSpace Component', () => {
  const previousUrl = 'http://localhost:8080/shared/questionnaire/previous'
  const currentUrl = 'http://localhost:8080/shared/questionnaire/current'

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
      render(<QuestSpace />)
    })
    const questSpaceElement = screen.getByTestId('quest-space') // Utilisation de getByTestId
    expect(questSpaceElement).toBeInTheDocument()
  })

  it('shows the tile of Mes Questionnaires', async () => {
    await act(async () => {
      render(<QuestSpace />)
    })
    const titleElement = screen.getByText('Mes Questionnaires')
    expect(titleElement).toBeInTheDocument()
  })

  it('tests catch error', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })

    await act(async () => {
      render(<QuestSpace />)
    })
    const titleElement = screen.getByText('Mes Questionnaires')
    expect(titleElement).toBeInTheDocument()
  })

  it('goes to the form', async () => {
    await act(async () => {
      render(<QuestSpace />)
    })
    const previousformStatus = screen.queryByText('Ce questionnaire est fini.')
    expect(previousformStatus).toBeInTheDocument()

    const currentformStatus = screen.queryByText('Ce questionnaire a été commencé.')
    expect(currentformStatus).toBeInTheDocument()
  })
})
