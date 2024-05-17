import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import AlertCreationPopupContent from '../../../Components/Popup/alertCreation'

describe('Popup', () => {
    const getRolesList = `${process.env.REACT_APP_BACKEND_URL}/shared/roles`
    const getClasses = `${process.env.REACT_APP_BACKEND_URL}/shared/classes`

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

      beforeEach(() => {
        fetchMock.reset()
        fetchMock.config.overwriteRoutes = true
        fetchMock.get(getRolesList, { status: 401 })
        fetchMock.get(getClasses, classes)
      })

      afterEach(() => {
        fetchMock.restore()
      })

    test('checks disconnect through roles', async () => {
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
  })
