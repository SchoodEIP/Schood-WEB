import '@testing-library/jest-dom'
import React from 'react'
import { render, act, screen, waitFor, fireEvent } from '@testing-library/react'
import FormListStudentPage from '../../../Users/Student/formListStudentPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import moment from 'moment'
import { disconnect } from '../../../functions/disconnect'

jest.mock('../../../functions/disconnect', () => ({
  disconnect: jest.fn(),
}));

describe('FormListStudentPage', () => {
  const formUrl = process.env.REACT_APP_BACKEND_URL + '/shared/questionnaire'
  let container = null

  function getFormDates () {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diffThisWeekMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust when today is Sunday
    const thisWeekMonday = new Date(today.setDate(diffThisWeekMonday))

    thisWeekMonday.setUTCHours(0, 0, 0, 0)

    const thisWeekSunday = new Date(thisWeekMonday)

    thisWeekSunday.setDate(thisWeekSunday.getDate() + 6)
    thisWeekSunday.setUTCHours(23, 59, 59, 0)

    return [thisWeekMonday, thisWeekSunday]
  }

  const [thisWeekMonday, thisWeekSunday] = getFormDates()

  const forms = [
    {

      fromDate: thisWeekMonday,
      toDate: thisWeekSunday,
      questionnaires: [
        {
          facility: "6638a70fdd18a1e42e53944d",
          createdBy: {
            active: true,
            createdAt: "2024-05-06T09:46:56.164Z",
            email: "pierre.dubois.Schood1@schood.fr",
            firstname: "Pierre",
            lastname: "Dubois",
            picture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQA",
            updatedAt: "2024-05-06T09:46:56.164Z",
            __v: 0,
            _id: "6638a710dd18a1e42e539476"
          },
          _id: '123',
          title: 'Test',
          classes: [{
            name: '200',
            _id: '123'
          }]
        }
      ]

    }
  ]

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.config.overwriteRoutes = true
    fetchMock.reset()
    fetchMock.get(formUrl, forms)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    fetchMock.restore()
  })

  test('page successfully created', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })
    expect(screen.getByText('Mes Questionnaires')).toBeInTheDocument()
  })

  test('checks disconnect through form url', async () => {
    fetchMock.get(formUrl, 401)
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    await waitFor(() => {
      expect(disconnect).toHaveBeenCalled();
    });
  })

  test('recuperation of forms', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Du ' + moment(thisWeekMonday).format('DD/MM/YYYY') + ' au ' + moment(thisWeekSunday).format('DD/MM/YYYY'))).toBeInTheDocument()
  })

  test('redirect to specific form', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <WebsocketProvider>
            <FormListStudentPage />
          </WebsocketProvider>
        </BrowserRouter>
      )
    })

    const originalLocation = window.location

    delete window.location
    window.location = {
      href: ''
    }

    const accessFormBtn = screen.getByText('Test')

    await act(async () => {
      fireEvent.click(accessFormBtn)
    })

    window.location = originalLocation
  })
})
