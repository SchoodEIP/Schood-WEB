import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdmAccountsPage from '../../../Users/Admin/AdmAccountsPage'
import { BrowserRouter } from 'react-router-dom'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

describe('AdmAccountsPage', () => {
  let container

  const server = setupServer(
    rest.post('/adm/register', (req, res, ctx) => {
      // Mock the response here
      return res(ctx.json({ message: 'Account created successfully' }))
    }),
    rest.post('/adm/csvRegisterUser', (req, res, ctx) => {
      // Mock the response here
      return res(ctx.json({ message: 'CSV account creation successful' }))
    })
  )

  beforeAll(() => server.listen())
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    document.body.removeChild(container)
    container = null
    server.resetHandlers()
    jest.clearAllMocks()
  })
  afterAll(() => server.close())

  test('renders the page', () => {
    render(
      <BrowserRouter>
        <AdmAccountsPage />
      </BrowserRouter>
    )

    expect(screen.getByText('Prénom')).toBeInTheDocument()
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByTestId('single-account-btn')).toBeInTheDocument()
    expect(screen.getByTestId('many-account-btn')).toBeInTheDocument()
  })

  test('allows creation of new account', () => {
    render(
      <BrowserRouter>
        <AdmAccountsPage />
      </BrowserRouter>
    )

    const singleAccountButton = screen.getByText('Ajouter un compte')

    fireEvent.click(singleAccountButton)
    expect(screen.getByText("Création d'un compte Administrateur Scolaire")).toBeInTheDocument()

    const firstNameInput = screen.getByPlaceholderText('Prénom')
    const lastNameInput = screen.getByPlaceholderText('Nom')
    const emailInput = screen.getByPlaceholderText('Email')

    expect(firstNameInput).toHaveValue('')
    expect(lastNameInput).toHaveValue('')
    expect(emailInput).toHaveValue('')

    fireEvent.change(firstNameInput, { target: { value: 'John' } })
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } })

    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
    expect(emailInput).toHaveValue('john.doe@example.com')

    const newAccountBtn = screen.getByText('Créer un nouveau compte')
    fireEvent.click(newAccountBtn)

    const errMessage = screen.getByTestId('err-message')
    expect(errMessage).toBeInTheDocument()
  })

  test('allows creation of new accounts with a file', () => {
    act(() => {
      render(
        <BrowserRouter>
          <AdmAccountsPage />
        </BrowserRouter>
      )
    })

    const manyAccountButton = screen.getByText('Ajouter une liste de comptes')

    act(() => {
      fireEvent.click(manyAccountButton)
    })
    expect(screen.getByText("Création d'une liste de comptes Administrateur Scolaire")).toBeInTheDocument()

    const fileInput = screen.getByPlaceholderText('exemple.csv')
    const file = new File(['firstName,lastName,email'], 'example.csv', { type: 'text/csv' })
    act(() => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    const newAccountBtn = screen.getByText('Créer de nouveaux comptes')
    act(() => {
      fireEvent.click(newAccountBtn)
    })
    const errMessage = screen.getByTestId('err-message')
    expect(errMessage).toBeInTheDocument()
  })
})
