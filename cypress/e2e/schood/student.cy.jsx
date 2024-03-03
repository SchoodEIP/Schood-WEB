/// <reference types="cypress" />

describe('Student', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  afterEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
  })

  it('checks admin part works', () => {
    cy.get('#userInput').type('student1@schood.fr')
    cy.get('#passInput').type('student123')
    cy.get('#submit-button').click()
    cy.should(() => {
      expect(localStorage.getItem('role')).to.eq('student')
      expect(sessionStorage.getItem('role')).to.eq('student')
      expect(localStorage.getItem('token')).to.not.eq(null)
      expect(sessionStorage.getItem('token')).to.not.eq(null)
    })
    cy.url().should('eq', 'http://localhost:3000/')
    cy.get('#sidebar-item-1').click()
    cy.url().should('eq', 'http://localhost:3000/questionnaires')
  })
})
