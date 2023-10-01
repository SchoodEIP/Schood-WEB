import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AidePage from '../../../Components/Aides/aides';

// Mock de useEffect pour éviter de faire des appels HTTP réels
jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

describe('AidePage component', () => {
  it('renders without errors', () => {
    render(<AidePage />);
    // Vérifie que le composant s'affiche sans erreurs
    expect(screen.getByText('Numéros de Contact')).toBeInTheDocument();
  });

  it('displays categories and contacts', () => {
    render(<AidePage />);

    // Vérifie que les catégories sont affichées
    expect(screen.getByText('Catégories')).toBeInTheDocument();
    expect(screen.getByText('Harcèlement')).toBeInTheDocument();
    expect(screen.getByText('Problème à la maison')).toBeInTheDocument();

    // Vérifie que les numéros de contact sont affichés
    expect(screen.getByText('Numéros de Contact')).toBeInTheDocument();
    expect(screen.getByText('Aide contre le harcèlement')).toBeInTheDocument();
    expect(screen.getByText('Ligne d\'urgence pour les victimes de violence familiale')).toBeInTheDocument();
  });

  it('filters contacts when a category is clicked', () => {
    render(<AidePage />);

    // Clique sur la catégorie "Harcèlement"
    fireEvent.click(screen.getByText('Harcèlement'));

    // Vérifie que seuls les contacts de la catégorie "Harcèlement" sont affichés
    expect(screen.getByText('Aide contre le harcèlement')).toBeInTheDocument();
    expect(screen.queryByText('Ligne d\'urgence pour les victimes de violence familiale')).not.toBeInTheDocument();
  });
});
