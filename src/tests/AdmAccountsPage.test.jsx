import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdmAccountsPage from '../Users/Admin/AdmAccountsPage'

describe('AdmAccountsPage', () => {
  test('renders the page', () => {
    render(<AdmAccountsPage />)
  })
})
