/// <reference types="cypress" />

describe('Admin', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })

    afterEach(() => {
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
        cy.url().should('eq', 'http://localhost:3000/');
        cy.get('#sidebar-item-1').click()
        cy.url().should('eq', 'http://localhost:3000/accounts');

        //create an account
        cy.get('#single-account-btn').click()
        cy.get('input[placeholder="Prénom"]').as('firstNameInput');
        cy.get('input[placeholder="Nom"]').as('lastNameInput');
        cy.get('input[placeholder="Email"]').as('emailInput');

        cy.get('@firstNameInput').type('John')
        cy.get('@firstNameInput').should('have.value', 'John');
        cy.get('@lastNameInput').type('Doe')
        cy.get('@lastNameInput').should('have.value', 'Doe');
        cy.get('@emailInput').type('john.doe@schood.fr')
        cy.get('@emailInput').should('have.value', 'john.doe@schood.fr');

        const singleAccountCreationUrl = 'http://localhost:8080/adm/register'
        cy.intercept('POST', singleAccountCreationUrl, (req) => {
            req.reply({
              ok: true,
              status: 200,
              body: {},
            });
          }).as('getMock');

        cy.get('.account-submit-btn').click()
        cy.get('#err-message').should('have.text', 'Compte créé avec succès')

        cy.get('.btn-close').click()

        //create many accounts
        cy.get('#many-account-btn').click()

        const manyAccountCreationUrl = 'http://localhost:8080/adm/csvRegisterUser'
        cy.intercept('POST', manyAccountCreationUrl, (req) => {
            req.reply({
              ok: true,
              status: 200,
              body: {},
            });
          }).as('getMock');

        cy.get('.account-submit-btn').click()
        cy.get('#err-message').should('have.text', 'Compte(s) créé(s) avec succès')

        cy.get('.btn-close').click()

        // check message page
        cy.get('#sidebar-item-3').click()
        cy.url().should('eq', 'http://localhost:3000/messages');
        cy.contains('Mes messages').should('exist')

        // checks logout

        cy.get('#logout-button').click()
        cy.url().should('eq', 'http://localhost:3000/login');

    })
})