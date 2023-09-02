import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, act, waitFor } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import FormPage from '../../../Users/Teacher/formPage'
import { BrowserRouter } from 'react-router-dom'

describe('FormPage', () => {
  const questionnaireUrl = process.env.REACT_APP_BACKEND_URL + '/teacher/questionnaire'
  let container = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    fetchMock.reset()
    fetchMock.get(questionnaireUrl, { })
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
    jest.clearAllMocks()
    fetchMock.restore()
  })

  test('renders the page', async () => {
    const testId = '123';
     act( () => {
      render(
        <BrowserRouter initialEntries={[`/questionnaire/${testId}`]}>
          <FormPage />
        </BrowserRouter>
      )
    })

    await waitFor(() => {
        expect(screen.getByText(`Affiche le questionnaire ici`, { selector: 'p' })).toBeInTheDocument();
    })
    expect(screen.getByText('Back')).toBeInTheDocument()
  })
})
