import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeaderComp from '../Components/Header/HeaderComp';


describe('HeaderComp', () => {
    test('should render logo and user icon', () => {
        render(<HeaderComp />);
        const logo = screen.getByAltText('logo');
        const userIcon = screen.getByAltText('User');
        expect(logo).toBeInTheDocument();
        expect(userIcon).toBeInTheDocument();
    });

    test('should call handleClickLogout when power icon is clicked', () => {
        const handleClickLogoutMock = jest.fn();
        jest.spyOn(window.location, 'assign').mockImplementation(() => {});

        render(<HeaderComp handleClickLogout={handleClickLogoutMock} />);
        fireEvent.click(screen.getByAltText('Disconnect'));

        expect(handleClickLogoutMock).toHaveBeenCalled();
        expect(localStorage.getItem('token')).toBeNull();
        window.location.assign.mockRestore();
    });
});