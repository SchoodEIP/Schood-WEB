import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdmAccountCreation from '../Components/Accounts/Adm/AdmAccountCreation';

describe('AdmAccountCreation', () => {
    it('should render input fields and a button', () => {
        render(<AdmAccountCreation />);
        expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
        expect(screen.getByLabelText('Nom')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Créer un compte' })).toBeInTheDocument();
    });

    it('should allow entering text into the input fields', () => {
        render(<AdmAccountCreation />);
        const firstNameInput = screen.getByLabelText('Prénom');
        const lastNameInput = screen.getByLabelText('Nom');
        const emailInput = screen.getByLabelText('Email');

        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });

        expect(firstNameInput).toHaveValue('John');
        expect(lastNameInput).toHaveValue('Doe');
        expect(emailInput).toHaveValue('john.doe@example.com');
    });
});