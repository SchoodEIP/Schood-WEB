import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdmAccountsPage from '../Users/Admin/AdmAccountsPage'
import { BrowserRouter } from 'react-router-dom'

describe('AdmAccountsPage', () => {
  test('renders the page', () => {
    render(
      <BrowserRouter>
        <AdmAccountsPage />
      </BrowserRouter>
    )
  })
})
