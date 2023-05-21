/// <reference types="cypress" />

describe('AdmAccountsPage', () => {
  it('renders all elements correctly', () => {
    cy.visit('/Adm/Accounts')

    cy.get('div#header-comp').should('exist')
    cy.get('div#sidebar').should('exist')
    cy.get('div#adm-accounts-table').should('exist')
    cy.get('div#adm-account-creation').should('exist')
  })
})
