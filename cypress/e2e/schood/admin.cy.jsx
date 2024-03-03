/// <reference types="cypress" />

describe('Admin', () => {
  before(() => {
    cy.visit('http://localhost:3000/login')
  })

  after(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
  })

  it('checks admin part works', () => {
    cy.get('#userInput').type('admin@schood.fr')
    cy.get('#passInput').type('admin123')
    cy.get('#submit-button').click()
    cy.should(() => {
      expect(localStorage.getItem('role')).to.eq('admin')
      expect(sessionStorage.getItem('role')).to.eq('admin')
      expect(localStorage.getItem('token')).to.not.eq(null)
      expect(sessionStorage.getItem('token')).to.not.eq(null)
    })
    cy.url().should('eq', 'http://localhost:3000/')
    cy.get('#sidebar-item-1').click()
    cy.url().should('eq', 'http://localhost:3000/accounts')
  })
})
