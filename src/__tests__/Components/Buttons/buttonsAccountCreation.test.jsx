import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ButtonsAccountCreation from '../../../Components/Buttons/buttonsAccountCreation'

describe('ButtonsAccountCreation', () => {
  const mockToggleSingleAccount = jest.fn()
  const mockToggleManyAccounts = jest.fn()

  test('renders component with correct button colors and click behavior', () => {
    const isOpenSingle = true
    const isOpenMany = false

    render(
      <ButtonsAccountCreation
        isOpenSingle={isOpenSingle}
        isOpenMany={isOpenMany}
        toggleSingleAccount={mockToggleSingleAccount}
        toggleManyAccounts={mockToggleManyAccounts}
      />
    )

    const singleAccountButton = screen.getByText('Ajouter un compte')
    const manyAccountButton = screen.getByText('Ajouter une liste de comptes')

    expect(singleAccountButton).toHaveStyle('background-color: rgb(140, 82, 255)')
    expect(manyAccountButton).toHaveStyle('background-color: rgb(79, 35, 226)')

    fireEvent.click(singleAccountButton)
    expect(mockToggleSingleAccount).toHaveBeenCalled()

    fireEvent.click(manyAccountButton)
    expect(mockToggleManyAccounts).toHaveBeenCalled()
  })
})
