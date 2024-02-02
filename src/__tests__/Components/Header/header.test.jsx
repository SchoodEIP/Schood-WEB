import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Ajoutez cette ligne

import HeaderComp from '../../../Components/Header/headerComp';

describe('HeaderComp', () => {
  test('should render logo and user icon', () => {
    render(
      <MemoryRouter>
        <HeaderComp />
      </MemoryRouter>
    );
    const logo = screen.getByAltText('logo');
    const userIcon = screen.getByTestId('profil');
    expect(logo).toBeInTheDocument();
    expect(userIcon).toBeInTheDocument();
  });

  test('should empty localStorage and sessionStorage', async () => {
    render(
      <MemoryRouter>
        <HeaderComp />
      </MemoryRouter>
    );
    const logout = screen.getByTestId('logout-button');
    expect(logout.tagName).toBe('A');

    window.localStorage.setItem('token', 'falseToken');
    window.localStorage.setItem('role', 'admin');
    window.sessionStorage.setItem('token', 'falseToken');
    window.sessionStorage.setItem('role', 'admin');
    expect(window.localStorage.getItem('token')).toBe('falseToken');
    expect(window.localStorage.getItem('role')).toBe('admin');
    expect(window.sessionStorage.getItem('token')).toBe('falseToken');
    expect(window.sessionStorage.getItem('role')).toBe('admin');

    fireEvent.click(screen.getByTestId('logout-button'));

    expect(window.localStorage.getItem('token')).toBe(null);
    expect(window.localStorage.getItem('role')).toBe(null);
    expect(window.sessionStorage.getItem('token')).toBe(null);
    expect(window.sessionStorage.getItem('role')).toBe(null);
  });
});
