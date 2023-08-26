import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import SchoolAdmAccountsPage from '../../../Users/SchoolAdmin/SchoolAdmAccountsPage'
import { BrowserRouter } from 'react-router-dom'
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('SchoolAdmAccountsPage', () => {

  let container;

  const server = setupServer(
    rest.post('/adm/register', (req, res, ctx) => {
      // Mock the response here
      return res(ctx.json({ message: 'Account created successfully' }));
    }),
    rest.post('/adm/csvRegisterUser', (req, res, ctx) => {
      // Mock the response here
      return res(ctx.json({ message: 'CSV account creation successful' }));
    })
  );

  beforeAll(() => server.listen());
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  test('renders the page', () => {
    render(
      <BrowserRouter>
        <SchoolAdmAccountsPage />
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
        <SchoolAdmAccountsPage />
      </BrowserRouter>
    )

    const singleAccountButton = screen.getByText('Ajouter un compte');

    fireEvent.click(singleAccountButton);
    expect(screen.getByText("Création d'un compte Etudiant/Professeur")).toBeInTheDocument()

    const firstNameInput = screen.getByPlaceholderText('Prénom')
    const lastNameInput = screen.getByPlaceholderText('Nom')
    const emailInput = screen.getByPlaceholderText('Email')
    const roleInput = screen.getByPlaceholderText('Rôle')
    const classInput = screen.getByPlaceholderText('Classe')

    expect(firstNameInput).toHaveValue('')
    expect(lastNameInput).toHaveValue('')
    expect(emailInput).toHaveValue('')
    expect(roleInput).toHaveValue('')
    expect(classInput).toHaveValue('')

    fireEvent.change(firstNameInput, { target: { value: 'John' } })
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } })
    fireEvent.change(roleInput, { target: { value: 'student' } })
    fireEvent.change(classInput, { target: { value: '1S' } })

    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
    expect(emailInput).toHaveValue('john.doe@example.com')
    expect(roleInput).toHaveValue('student')
    expect(classInput).toHaveValue('1S')

    const newAccountBtn = screen.getByText("Créer un nouveau compte")
    fireEvent.click(newAccountBtn);

    const errMessage = screen.getByTestId('err-message');
    expect(errMessage).toBeInTheDocument();
  })

  test('allows creation of new accounts with a file', () => {
    act(() => {
      render(
        <BrowserRouter>
          <SchoolAdmAccountsPage />
        </BrowserRouter>
      )
    });

    const manyAccountButton = screen.getByText('Ajouter une liste de comptes');

    act(() => {
      fireEvent.click(manyAccountButton);
    });
    expect(screen.getByText("Création d'une liste de comptes Etudiant/Professeur")).toBeInTheDocument()

    const fileInput = screen.getByPlaceholderText('exemple.csv')
    const file = new File(['firstName,lastName,email,role,classe'], 'example.csv', { type: 'text/csv' });
    act(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    const newAccountBtn = screen.getByText("Créer de nouveaux comptes")
    act(() => {
      fireEvent.click(newAccountBtn);
    });
    const errMessage = screen.getByTestId('err-message');
    expect(errMessage).toBeInTheDocument();

  })
})
