/// <reference types="cypress" />

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  afterEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
  })

  it('checks login works', () => {
    cy.get('#userInput').type('admin@schood.fr')
    cy.get('#passInput').type('admin123')
    cy.get('#login-button').click().should(() => {
      expect(localStorage.getItem('role')).to.eq('admin')
      expect(sessionStorage.getItem('role')).to.eq('admin')
      expect(localStorage.getItem('token')).to.not.eq(null)
      expect(sessionStorage.getItem('token')).to.not.eq(null)
    })
  })
})
