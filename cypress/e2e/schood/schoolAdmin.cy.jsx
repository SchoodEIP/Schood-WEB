/// <reference types="cypress" />

describe('School Admin', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  afterEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
  })

  it('checks admin part works', () => {
    cy.get('#userInput').type('adm@schood.fr')
    cy.get('#passInput').type('adm123')
    cy.get('#submit-button').click()
    cy.should(() => {
      expect(localStorage.getItem('role')).to.eq('administration')
      expect(sessionStorage.getItem('role')).to.eq('administration')
      expect(localStorage.getItem('token')).to.not.eq(null)
      expect(sessionStorage.getItem('token')).to.not.eq(null)
    })
    cy.url().should('eq', 'http://localhost:3000/')
    cy.intercept('GET', 'http://localhost:3000/user/all', (req) => {
      req.reply({
        ok: true,
        status: 200,
        body: [
          {
            firstname: 'laura',
            lastname: 'citron',
            email: 'laura@schood.fr',
            role: {
              _id: 1,
              name: 'teacher',
              levelOfAccess: 1
            },
            classes: {
              _id: 0,
              name: '200'
            }
          },
          {
            firstname: 'thomas',
            lastname: 'apple',
            email: 'thomas@schood.fr',
            role: {
              _id: 1,
              name: 'student',
              levelOfAccess: 1
            },
            classes: {
              _id: 0,
              name: '200'
            }
          }
        ]
      })
    }).as('getUsers')

    cy.intercept('GET', 'http://localhost:3000/adm/classes', (req) => {
      req.reply({
        ok: true,
        status: 200,
        body: [
          {
            _id: 0,
            name: '200',
            facility: '0'
          },
          {
            _id: 1,
            name: '201',
            facility: '0'
          }
        ]
      })
    }).as('getClasses')

    cy.intercept('GET', 'http://localhost:3000/adm/rolesList', (req) => {
      req.reply({
        ok: true,
        status: 200,
        body: [
          {
            _id: 0,
            name: 'student',
            levelOfAccess: 0
          },
          {
            _id: 1,
            name: 'teacher',
            levelOfAccess: 1
          },
          {
            _id: 2,
            name: 'administration',
            levelOfAccess: 2
          },
          {
            _id: 3,
            name: 'admin',
            levelOfAccess: 3
          }
        ]
      })
    }).as('getRoles')
    cy.get('#sidebar-item-1').click()
    cy.url().should('eq', 'http://localhost:3000/accounts')

    // create an account
    cy.get('#single-account-btn').click()
    cy.get('input[placeholder="Prénom"]').as('firstNameInput')
    cy.get('input[placeholder="Nom"]').as('lastNameInput')
    cy.get('input[placeholder="Email"]').as('emailInput')

    cy.get('@firstNameInput').type('John')
    cy.get('@firstNameInput').should('have.value', 'John')
    cy.get('@lastNameInput').type('Doe')
    cy.get('@lastNameInput').should('have.value', 'Doe')
    cy.get('@emailInput').type('john.doe@schood.fr')
    cy.get('@emailInput').should('have.value', 'john.doe@schood.fr')
    cy.get('#classe-select').select('200')

    const singleAccountCreationUrl = 'http://localhost:8080/adm/register'
    cy.intercept('POST', singleAccountCreationUrl, (req) => {
      req.reply({
        ok: true,
        status: 200,
        body: {}
      })
    }).as('postRegister')

    cy.get('.account-submit-btn').click()
    cy.get('#err-message').should('have.text', 'Compte créé avec succès')

    cy.get('.btn-close').click()

    // create many accounts
    cy.get('#many-account-btn').click()

    const manyAccountCreationUrl = 'http://localhost:8080/adm/csvRegisterUser'
    cy.intercept('POST', manyAccountCreationUrl, (req) => {
      req.reply({
        ok: true,
        status: 200,
        body: {}
      })
    }).as('postCsv')

    cy.get('.account-submit-btn').click()
    cy.get('#err-message').should('have.text', 'Compte(s) créé(s) avec succès')

    cy.get('.btn-close').click()

    // // check message page
    // cy.get('#sidebar-item-3').click()
    // cy.url().should('eq', 'http://localhost:3000/messages');
    // cy.contains('Mes messages').should('exist')

    // // checks logout

    // cy.get('#logout-button').click()
    // cy.url().should('eq', 'http://localhost:3000/login');
  })
})
