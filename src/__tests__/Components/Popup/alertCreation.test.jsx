import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import AlertCreationPopupContent from '../../../Components/Popup/alertCreation'
import fetchMock from 'fetch-mock'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn(),
}));

describe('AlertCreation', () => {
    const getRolesList = `${process.env.REACT_APP_BACKEND_URL}/shared/roles`
    const getClasses = `${process.env.REACT_APP_BACKEND_URL}/shared/classes`
    const sharedAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert`
    const postFileToAlert = `${process.env.REACT_APP_BACKEND_URL}/shared/alert/file/undefined`

    const classes = [
        {
          _id: 0,
          name: '200',
          facility: '0'
        },
        {
          _id: 1,
          name: '201',
          facility: '0'
        }
      ]

    const roles = [
        {
          _id: 0,
          name: 'student',
          levelOfAccess: 0
        },
        {
          _id: 1,
          name: 'teacher',
          levelOfAccess: 1
        },
        {
          _id: 2,
          name: 'administration',
          levelOfAccess: 2
        },
        {
          _id: 3,
          name: 'admin',
          levelOfAccess: 3
        }
      ]

      const fileToAlertResponse = {
        status: 200,
        type: 'cors',
        statusText: 'OK',
        headers: {
          'content-length': 7832,
          'content-type': 'image/jpeg'
        },
        ok: true,
        redirected: false,
        url: 'https://localhost:8080/user/file/123',
        body: { locked: true }
      }

      const dummyBlob = new Blob(['dummy content'], { type: 'text/plain' });

      beforeEach(() => {
        fetchMock.reset()
        fetchMock.config.overwriteRoutes = true
        fetchMock.get(getRolesList, roles)
        fetchMock.get(getClasses, classes)
        fetchMock.post(postFileToAlert, fileToAlertResponse)
        fetchMock.post(sharedAlert, {})
        sessionStorage.setItem('role', 'admin')
        delete window.location;
        window.location = { reload: jest.fn() };

      })

      afterEach(() => {
        fetchMock.restore()
      })

      it('shows and hides roles and classes', async () => {
        await act(async () => {
          render(
            <BrowserRouter>
              <WebsocketProvider>
                <AlertCreationPopupContent />
              </WebsocketProvider>
            </BrowserRouter>
          )
        })

        const rolesBtn = screen.getByText('Utilisateurs Visés')
        await waitFor(async () => {
          expect(rolesBtn).toBeInTheDocument()
        })
        const classesBtn = screen.getByText('Classe(s) visée(s)')
        await waitFor(async () => {
          expect(classesBtn).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.click(rolesBtn)
        })
        await act(async () => {
          fireEvent.click(classesBtn)
        })
      })

      it('sends an alert without a file', async () => {
        await act(async () => {
          render(
            <BrowserRouter>
              <WebsocketProvider>
                <AlertCreationPopupContent />
              </WebsocketProvider>
            </BrowserRouter>
          )
        })

        await act(async () => {
          fireEvent.click(screen.getByText('Utilisateurs Visés'))
        })

        await waitFor(async () => {
          expect(screen.getByTestId('roles-select')).toBeInTheDocument()
        })

        await act(async () => {
          fireEvent.change(screen.getByTestId('roles-select'), { target: { value: '1' } })
        })

        const classesBtn = screen.getByText('Classe(s) visée(s)')
        await waitFor(async () => {
          expect(classesBtn).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.click(classesBtn)
        })
        const checkbox200 = screen.getByTestId('class-check-0')
        await waitFor(async () => {
          expect(checkbox200).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.click(checkbox200)
        })

        const alertTitle = screen.getByPlaceholderText('Titre')
        await waitFor(async () => {
          expect(alertTitle).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.change(alertTitle, { target: { value: 'test' } })
        })
        await waitFor(async () => {
          expect(alertTitle).toHaveValue('test')
        })

        const alertMessage = screen.getByPlaceholderText('Message')
        await waitFor(async () => {
          expect(alertMessage).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.change(alertMessage, { target: { value: 'test message' } })
        })
        await waitFor(async () => {
          expect(alertMessage).toHaveValue('test message')
        })

        const fileInput = screen.getByTestId('alert-file-input')
        await waitFor(async () => {
          expect(fileInput).toBeInTheDocument()
        })

        const sendButton = screen.getByText("Créer l'Alerte")
        await waitFor(async () => {
          expect(sendButton).toBeInTheDocument()
        })

        await act(async () => {
          fireEvent.click(sendButton)
        })

        expect(window.location.reload).toHaveBeenCalled();

      })

      it('sends an alert with a file', async () => {
        await act(async () => {
          render(
            <BrowserRouter>
              <WebsocketProvider>
                <AlertCreationPopupContent />
              </WebsocketProvider>
            </BrowserRouter>
          )
        })

        await act(async () => {
          fireEvent.click(screen.getByText('Utilisateurs Visés'))
        })

        await waitFor(async () => {
          expect(screen.getByTestId('roles-select')).toBeInTheDocument()
        })

        await act(async () => {
          fireEvent.change(screen.getByTestId('roles-select'), { target: { value: '1' } })
        })

        const classesBtn = screen.getByText('Classe(s) visée(s)')
        await waitFor(async () => {
          expect(classesBtn).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.click(classesBtn)
        })
        const checkbox200 = screen.getByTestId('class-check-0')
        await waitFor(async () => {
          expect(checkbox200).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.click(checkbox200)
        })

        const alertTitle = screen.getByPlaceholderText('Titre')
        await waitFor(async () => {
          expect(alertTitle).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.change(alertTitle, { target: { value: 'test' } })
        })
        await waitFor(async () => {
          expect(alertTitle).toHaveValue('test')
        })

        const alertMessage = screen.getByPlaceholderText('Message')
        await waitFor(async () => {
          expect(alertMessage).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.change(alertMessage, { target: { value: 'test message' } })
        })
        await waitFor(async () => {
          expect(alertMessage).toHaveValue('test message')
        })

        const fileInput = screen.getByTestId('alert-file-input')
        await waitFor(async () => {
          expect(fileInput).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.change(fileInput, { target: { files: [{ file: 'image' }] } })
        })

        const sendButton = screen.getByText("Créer l'Alerte")
        await waitFor(async () => {
          expect(sendButton).toBeInTheDocument()
        })

        await act(async () => {
          fireEvent.click(sendButton)
        })

        expect(window.location.reload).toHaveBeenCalled();

      })

      it('disconnect when posting file', async () => {
        fetchMock.post(postFileToAlert, 401)

        await act(async () => {
          render(
            <BrowserRouter>
              <WebsocketProvider>
                <AlertCreationPopupContent />
              </WebsocketProvider>
            </BrowserRouter>
          )
        })

        await act(async () => {
          fireEvent.click(screen.getByText('Utilisateurs Visés'))
        })

        await waitFor(async () => {
          expect(screen.getByTestId('roles-select')).toBeInTheDocument()
        })

        await act(async () => {
          fireEvent.change(screen.getByTestId('roles-select'), { target: { value: '1' } })
        })

        const classesBtn = screen.getByText('Classe(s) visée(s)')
        await waitFor(async () => {
          expect(classesBtn).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.click(classesBtn)
        })
        const checkbox200 = screen.getByTestId('class-check-0')
        await waitFor(async () => {
          expect(checkbox200).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.click(checkbox200)
        })

        const alertTitle = screen.getByPlaceholderText('Titre')
        await waitFor(async () => {
          expect(alertTitle).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.change(alertTitle, { target: { value: 'test' } })
        })
        await waitFor(async () => {
          expect(alertTitle).toHaveValue('test')
        })

        const alertMessage = screen.getByPlaceholderText('Message')
        await waitFor(async () => {
          expect(alertMessage).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.change(alertMessage, { target: { value: 'test message' } })
        })
        await waitFor(async () => {
          expect(alertMessage).toHaveValue('test message')
        })

        const fileInput = screen.getByTestId('alert-file-input')
        await waitFor(async () => {
          expect(fileInput).toBeInTheDocument()
        })
        await act(async () => {
          fireEvent.change(fileInput, { target: { files: [{ file: 'image' }] } })
        })

        const sendButton = screen.getByText("Créer l'Alerte")
        await waitFor(async () => {
          expect(sendButton).toBeInTheDocument()
        })

        await act(async () => {
          fireEvent.click(sendButton)
        })

        await waitFor(() => {
          expect(disconnect).toHaveBeenCalled();
        });
      })

      test('receive Access Forbidden for classes', async () => {
        fetchMock.get(getClasses, {message: 'Access Forbidden'})
        await act(async () => {
          render(
            <BrowserRouter>
              <WebsocketProvider>
                <AlertCreationPopupContent />
              </WebsocketProvider>
            </BrowserRouter>
          )
        })

      })

      test('as role teacher', async () => {
        sessionStorage.setItem('role', 'teacher')
        await act(async () => {
          render(
            <BrowserRouter>
              <WebsocketProvider>
                <AlertCreationPopupContent />
              </WebsocketProvider>
            </BrowserRouter>
          )
        })

      })

      test('it checks error messages', async () => {

        await act(async () => {
          render(
            <BrowserRouter>
              <WebsocketProvider>
                <AlertCreationPopupContent />
              </WebsocketProvider>
            </BrowserRouter>
          )
        })

        await act(async () => {
          fireEvent.click(screen.getByText("Créer l'Alerte"))
        })

        await waitFor(async () => {
          expect(screen.getByText('Le titre est vide.')).toBeInTheDocument()
        })

        await act(async () => {
          fireEvent.change(screen.getByPlaceholderText('Titre'), { target: { value: 'test' } })
        })

        await act(async () => {
          fireEvent.click(screen.getByText("Créer l'Alerte"))
        })

        await waitFor(async () => {
          expect(screen.getByText('Le message est vide.')).toBeInTheDocument()
        })

        await act(async () => {
          fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: 'test message' } })
        })

        await act(async () => {
          fireEvent.click(screen.getByText("Créer l'Alerte"))
        })

        await waitFor(async () => {
          expect(screen.getByText("Aucune classe n'a été sélectionnée.")).toBeInTheDocument()
        })

        await act(async () => {
          fireEvent.click(screen.getByText('Utilisateurs Visés'))
        })

        await act(async () => {
          fireEvent.click(screen.getByText("Créer l'Alerte"))
        })

      })

    test('checks disconnect through roles', async () => {
      fetchMock.get(getRolesList, 401);

      await act(async () => {
        render(
          <BrowserRouter>
            <WebsocketProvider>
              <AlertCreationPopupContent />
            </WebsocketProvider>
          </BrowserRouter>
        )
      })

      await waitFor(() => {
        expect(disconnect).toHaveBeenCalled();
      });
    })


    test('checks disconnect through roles', async () => {
      fetchMock.get(getClasses, 401);

      await act(async () => {
        render(
          <BrowserRouter>
            <WebsocketProvider>
              <AlertCreationPopupContent />
            </WebsocketProvider>
          </BrowserRouter>
        )
      })

      await waitFor(() => {
        expect(disconnect).toHaveBeenCalled();
      });
    })


    it('disconnect when sharing alert', async () => {
      fetchMock.post(sharedAlert, 401)
      await act(async () => {
        render(
          <BrowserRouter>
            <WebsocketProvider>
              <AlertCreationPopupContent />
            </WebsocketProvider>
          </BrowserRouter>
        )
      })

      await act(async () => {
        fireEvent.click(screen.getByText('Utilisateurs Visés'))
      })

      await waitFor(async () => {
        expect(screen.getByTestId('roles-select')).toBeInTheDocument()
      })

      await act(async () => {
        fireEvent.change(screen.getByTestId('roles-select'), { target: { value: '1' } })
      })

      const classesBtn = screen.getByText('Classe(s) visée(s)')
      await waitFor(async () => {
        expect(classesBtn).toBeInTheDocument()
      })
      await act(async () => {
        fireEvent.click(classesBtn)
      })

      await waitFor(async () => {
        expect(screen.getByTestId('class-check-0')).toBeInTheDocument()
      })
      await act(async () => {
        fireEvent.click(screen.getByTestId('class-check-0'))
      })

      await act(async () => {
        fireEvent.click(screen.getByTestId('class-check-0'))
      })

      await act(async () => {
        fireEvent.click(screen.getByTestId('class-check-0'))
      })

      const alertTitle = screen.getByPlaceholderText('Titre')
      await waitFor(async () => {
        expect(alertTitle).toBeInTheDocument()
      })
      await act(async () => {
        fireEvent.change(alertTitle, { target: { value: 'test' } })
      })
      await waitFor(async () => {
        expect(alertTitle).toHaveValue('test')
      })

      const alertMessage = screen.getByPlaceholderText('Message')
      await waitFor(async () => {
        expect(alertMessage).toBeInTheDocument()
      })
      await act(async () => {
        fireEvent.change(alertMessage, { target: { value: 'test message' } })
      })
      await waitFor(async () => {
        expect(alertMessage).toHaveValue('test message')
      })

      const fileInput = screen.getByTestId('alert-file-input')
      await waitFor(async () => {
        expect(fileInput).toBeInTheDocument()
      })
      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [{ file: 'image' }] } })
      })

      const sendButton = screen.getByText("Créer l'Alerte")
      await waitFor(async () => {
        expect(sendButton).toBeInTheDocument()
      })

      await act(async () => {
        fireEvent.click(sendButton)
      })

      await waitFor(() => {
        expect(disconnect).toHaveBeenCalled();
      });
    })
  })
