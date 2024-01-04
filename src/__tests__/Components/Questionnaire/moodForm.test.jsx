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
        fetchMock.get(dailyMood, { moodStatus: false})
        fetchMock.post(dailyMood, { })
      })

      afterEach(() => {
        fetchMock.restore()
      })


    it('handles alternate response', async () => {
        const mockResponse = { moodStatus: true, mood: 'Heureux' };
        jest.spyOn(global, 'fetch').mockReturnValue(Promise.resolve({
            json: () => Promise.resolve(mockResponse),
          }))
        await act(async () => {
            render(
                <MemoryRouter>
                    <MoodForm />
                </MemoryRouter>
            )
        })

        expect(await screen.getByText('Votre humeur du jour : Heureux')).toBeInTheDocument()

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

        const AngryButton = screen.getByText('En colère')
        expect(AngryButton).toBeInTheDocument()

        await act(async () => {
            fireEvent.click(AngryButton)
        })

        expect(screen.getByText('Votre humeur du jour : En colère')).toBeInTheDocument()
    })

    it('shows depressed mood', async () => {
        await act(async () => {
            render(
              <MemoryRouter>
                <MoodForm />
              </MemoryRouter>
            )
        })

        const depressedButton = screen.getByText('Déprimé')
        expect(depressedButton).toBeInTheDocument()

        await act(async () => {
            fireEvent.click(depressedButton)
        })

        expect(screen.getByText('Votre humeur du jour : Déprimé')).toBeInTheDocument()
    })

    it('shows sad mood', async () => {
        await act(async () => {
            render(
              <MemoryRouter>
                <MoodForm />
              </MemoryRouter>
            )
        })

        const sadButton = screen.getByText('Triste')
        expect(sadButton).toBeInTheDocument()

        await act(async () => {
            fireEvent.click(sadButton)
        })

        expect(screen.getByText('Votre humeur du jour : Triste')).toBeInTheDocument()
    })

    it('shows content mood', async () => {
        await act(async () => {
            render(
              <MemoryRouter>
                <MoodForm />
              </MemoryRouter>
            )
        })

        const contentButton = screen.getByText('Content')
        expect(contentButton).toBeInTheDocument()

        await act(async () => {
            fireEvent.click(contentButton)
        })

        expect(screen.getByText('Votre humeur du jour : Content')).toBeInTheDocument()
    })

    it('shows happy mood', async () => {
        await act(async () => {
            render(
              <MemoryRouter>
                <MoodForm />
              </MemoryRouter>
            )
        })

        const happyButton = screen.getByText('Heureux')
        expect(happyButton).toBeInTheDocument()

        await act(async () => {
            fireEvent.click(happyButton)
        })

        expect(screen.getByText('Votre humeur du jour : Heureux')).toBeInTheDocument()
    })

    it('shows fulfilled mood', async () => {
        await act(async () => {
            render(
              <MemoryRouter>
                <MoodForm />
              </MemoryRouter>
            )
        })

        const fulfilledButton = screen.getByText('Épanoui')
        expect(fulfilledButton).toBeInTheDocument()

        await act(async () => {
            fireEvent.click(fulfilledButton)
        })

        expect(screen.getByText('Votre humeur du jour : Épanoui')).toBeInTheDocument()
    })

    it('shows error post mood', async () => {
        await act(async () => {
            render(
              <MemoryRouter>
                <MoodForm />
              </MemoryRouter>
            )
        })

        jest.spyOn(global, 'fetch').mockRejectedValue({ message: 'error' })
        const fulfilledButton = screen.getByText('Épanoui')
        expect(fulfilledButton).toBeInTheDocument()


        await act(async () => {
            fireEvent.click(fulfilledButton)
        })

        expect(await screen.getByText('Erreur :')).toBeInTheDocument()
    })
})