import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import AidePage from '../../../Components/Aides/aides'

// Mock de useEffect pour éviter de faire des appels HTTP réels
jest.spyOn(React, 'useEffect').mockImplementation((f) => f())

describe('AidePage component', () => {
  //  it('renders without errors', () => {
  //    render(<AidePage />);
  //    // Vérifie que le composant s'affiche sans erreurs
  //    expect(screen.queryByText('Numéros de Contact')).toBeInTheDocument();
  // });

  it('displays categories and contacts', () => {
    render(<AidePage />)

    // Vérifie que les catégories sont affichées
    expect(screen.getByText('Catégories')).toBeTruthy()
    expect(screen.getByTestId('category-btn-1')).toBeInTheDocument()
    expect(screen.getByTestId('category-btn-2')).toBeInTheDocument()

    const categorie = screen.getByText('Aide contre le harcèlement')

    // Vérifie que les numéros de contact sont affichés
    // expect(screen.getByText('Numéros de Contact')).toBeInTheDocument();
    expect(categorie).toBeInTheDocument()
    expect(screen.getByText("Ligne d'urgence pour les victimes de violence familiale")).toBeInTheDocument()
  })

  it('filters contacts when a category is clicked', async () => {
    render(<AidePage />)

    // Clique sur la catégorie "Harcèlement"
    await act(async () => {
      fireEvent.click(screen.getByTestId('category-btn-1'))
    })

    // Vérifie que seuls les contacts de la catégorie "Harcèlement" sont affichés
    expect(screen.queryByText('Aide contre le harcèlement')).toBeInTheDocument()
    expect(screen.queryByText('Ligne d\'urgence pour les victimes de violence familiale')).not.toBeInTheDocument()
  })
})
