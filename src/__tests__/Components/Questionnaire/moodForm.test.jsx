import React from 'react'
import { MoodForm } from '../../../Components/Questionnaire/moodForm.jsx'
import { render, screen, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('MoodForm Component', () => {
  const dailyMood = `${process.env.REACT_APP_BACKEND_URL}/shared/questionnaire/dailyMood`

  beforeEach(() => {
    fetchMock.reset()
    fetchMock.get(dailyMood, { moodStatus: false })
    fetchMock.post(dailyMood, { })
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('handles alternate response', async () => {
    const mockResponse = { moodStatus: true, mood: 'veryHappyMood' }
    jest.spyOn(global, 'fetch').mockReturnValue(Promise.resolve({
      json: () => Promise.resolve(mockResponse)
    }))
    await act(async () => {
      render(
        <MemoryRouter>
          <MoodForm />
        </MemoryRouter>
      )
    })

    expect(screen.getByAltText('Très Mal')).toBeInTheDocument()
    expect(screen.getByAltText('Mal')).toBeInTheDocument()
    expect(screen.getByAltText('Bof')).toBeInTheDocument()
    expect(screen.getByAltText('Bien')).toBeInTheDocument()
    expect(screen.getByAltText('Très Bien')).toBeInTheDocument()
  })

  it('handles errors', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })
    await act(async () => {
      render(
        <MemoryRouter>
          <MoodForm />
        </MemoryRouter>
      )
    })

    expect(await screen.getByText('Erreur :')).toBeInTheDocument()
  })

  it('shows angry mood', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <MoodForm />
        </MemoryRouter>
      )
    })

    const veryBadButton = screen.getByAltText('Très Mal')

    await act(async () => {
      fireEvent.click(veryBadButton)
    })

    expect(screen.getByAltText('Très Mal')).toBeInTheDocument()

    const BadButton = screen.getByAltText('Mal')

    await act(async () => {
      fireEvent.click(BadButton)
    })

    expect(screen.getByAltText('Mal')).toBeInTheDocument()

    const averageButton = screen.getByAltText('Bof')

    await act(async () => {
      fireEvent.click(averageButton)
    })

    expect(screen.getByAltText('Bof')).toBeInTheDocument()

    const goodButton = screen.getByAltText('Bien')

    await act(async () => {
      fireEvent.click(goodButton)
    })

    expect(screen.getByAltText('Bien')).toBeInTheDocument()

    const veryGoodButton = screen.getByAltText('Très Bien')

    await act(async () => {
      fireEvent.click(veryGoodButton)
    })

    expect(screen.getByAltText('Très Bien')).toBeInTheDocument()
  })
})
