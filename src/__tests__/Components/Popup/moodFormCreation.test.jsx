import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import MoodFormCreationPopupContent from '../../../Components/Popup/moodFormCreation'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
    disconnect: jest.fn(),
  }));

describe('Mood Form Creation Popup Content', () => {
    const moodUrl = `${process.env.REACT_APP_BACKEND_URL}/student/mood`

    beforeEach(() => {
        fetchMock.reset()
        fetchMock.post(moodUrl, 200)
        fetchMock.config.overwriteRoutes = true
        delete window.location;
        window.location = { reload: jest.fn() };
    })

    afterEach(() => {
        fetchMock.restore()
    })

    test('renders  correctly', async () => {
        await act(async () => {
            render(
              <BrowserRouter>
                <WebsocketProvider>
                  <MoodFormCreationPopupContent />
                </WebsocketProvider>
              </BrowserRouter>
            )
        })

        await act(async () => {
            fireEvent.click(screen.getByText('Créer le Ressenti'))
        })

        await waitFor(() => {
            expect(screen.getByText("L'humeur est manquante.")).toBeInTheDocument()
        })

        await act(async () => {
            fireEvent.click(screen.getByTitle('Mauvaise Humeur'))
        })

        const messageInput = screen.getByPlaceholderText('Message...')

        await act(async () => {
            fireEvent.change(messageInput, { target: { value: 'Feeling test' } })
        })

        await act(async () => {
            fireEvent.click(screen.getByTestId('anonymous-label'))
        })

        await act(async () => {
            fireEvent.click(screen.getByText('Créer le Ressenti'))
        })

        expect(window.location.reload).toHaveBeenCalled();

    })

    test('checks disconnect through post mood', async () => {
        fetchMock.post(moodUrl, 401);

        await act(async () => {
          render(
            <BrowserRouter>
              <WebsocketProvider>
                <MoodFormCreationPopupContent />
              </WebsocketProvider>
            </BrowserRouter>
          )
        })

        await act(async () => {
            fireEvent.click(screen.getByTitle('Très Bonne Humeur'))
        })

        await act(async () => {
            fireEvent.click(screen.getByTitle('Bonne Humeur'))
        })

        await act(async () => {
            fireEvent.click(screen.getByTitle('Humeur Neutre'))
        })

        await act(async () => {
            fireEvent.click(screen.getByTitle('Mauvaise Humeur'))
        })

        await act(async () => {
            fireEvent.click(screen.getByTitle('Très Mauvaise Humeur'))
        })

        const messageInput = screen.getByPlaceholderText('Message...')

        await act(async () => {
            fireEvent.change(messageInput, { target: { value: 'Feeling test' } })
        })

        await act(async () => {
            fireEvent.click(screen.getByTestId('anonymous-label'))
        })

        const createFeeling = screen.getByText('Créer le Ressenti')

        await act(async () => {
            fireEvent.click(createFeeling)
        })


        await waitFor(() => {
          expect(disconnect).toHaveBeenCalled();
        });
    })

    // test('checks disconnect through patch mood', async () => {
    //     fetchMock.patch(moodUrl, 401);

    //     await act(async () => {
    //         render(
    //         <BrowserRouter>
    //             <WebsocketProvider>
    //                 <MoodFormCreationPopupContent isModified={true} />
    //             </WebsocketProvider>
    //         </BrowserRouter>
    //         )
    //     })

    //     const joyButton = screen.getByTitle('Bonne Humeur')
    //     await act(async () => {
    //     fireEvent.click(joyButton)
    //     })

    //     const messageInput = screen.getByPlaceholderText('Message...')

    //     await act(async () => {
    //     fireEvent.change(messageInput, { target: { value: 'Feeling test' } })
    //     })

    //     const createFeeling = screen.getByText('Créer le Ressenti')

    //     await act(async () => {
    //     fireEvent.click(createFeeling)
    //     })

    //     await waitFor(() => {
    //         expect(disconnect).toHaveBeenCalled();
    //     });
    // })

})