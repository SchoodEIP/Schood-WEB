import '@testing-library/jest-dom'
import React from 'react'
import { render, act, screen, fireEvent } from '@testing-library/react'
import FormListStudentPage from '../../../Users/Student/formListStudentPage'
import { WebsocketProvider } from '../../../contexts/websocket'
import { BrowserRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import moment from 'moment'

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
      _id: '123',
      title: 'Test',
      fromDate:  thisWeekMonday.toISOString(),
      toDate:  thisWeekSunday.toISOString()
    }
  ]

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
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

    expect(screen.getByText('Y Accéder')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Du ' + moment(thisWeekMonday).format('DD/MM/YY') + ' au ' + moment(thisWeekSunday).format('DD/MM/YY'))).toBeInTheDocument()
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

    const accessFormBtn = screen.getByText('Y Accéder')

    await act(async () => {
      fireEvent.click(accessFormBtn)
    })

    expect(window.location.href).toBe('/questionnaire/123')

    window.location = originalLocation
  })
})
