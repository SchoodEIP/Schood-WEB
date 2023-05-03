import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdmHomePage from '../Users/Admin/AdmHomePage';

describe('AdmHomePage', () => {
    test('renders the LastAlerts component', () => {
        render(<AdmHomePage />);
        const lastAlertsTitle = screen.getByText("Mes Dernières Alertes");
        expect(lastAlertsTitle).toBeInTheDocument();
    });
});