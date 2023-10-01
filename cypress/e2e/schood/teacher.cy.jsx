/// <reference types="cypress" />

describe('Teacher', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login')
    })

    afterEach(() => {
        cy.clearAllLocalStorage()
        cy.clearAllSessionStorage()
    })

    it('checks admin part works', () => {
        cy.get('#userInput').type('teacher1@schood.fr')
        cy.get('#passInput').type('teacher123')
        cy.get('#submit-button').click()
        cy.should(() => {
            expect(localStorage.getItem('role')).to.eq('teacher')
            expect(sessionStorage.getItem('role')).to.eq('teacher')
            expect(localStorage.getItem('token')).to.not.eq(null)
            expect(sessionStorage.getItem('token')).to.not.eq(null)
        })
        cy.url().should('eq', 'http://localhost:3000/');
        cy.get('#sidebar-item-1').click()
        cy.url().should('eq', 'http://localhost:3000/questionnaires')

        cy.get('#form-create-btn').click()
        cy.url().should('eq', 'http://localhost:3000/questionnaire')

        cy.get('#form-title').as('titleInput')
        cy.get('@titleInput').type('This is a test')
        cy.get('@titleInput').should('have.value', 'This is a test')

        cy.get('#add-question-btn').click()
        cy.get('#question-0').as('questionInput')
        cy.get('@questionInput').type('This is a test question')
        cy.get('@questionInput').should('have.value', 'This is a test question')

        cy.get('#select-0').select('Multiple')

        cy.get('#form-input-0-0').as('answerInput0')
        cy.get('@answerInput0').type('yes')
        cy.get('@answerInput0').should('have.value', 'yes')

        cy.get('#form-input-0-1').as('answerInput1')
        cy.get('@answerInput1').type('no')
        cy.get('@answerInput1').should('have.value', 'no')

        cy.get('#add-answer-btn-0').click()
        cy.get('#remove-answer-btn-0').click()

        cy.get('#add-question-btn').click()
        cy.get('#remove-question-btn').click()

        cy.get('#parution-date').invoke('val', '2025-10-15')

        const formUrl = 'http://localhost:8080//teacher/questionnaire'
        cy.intercept('POST', formUrl, (req) => {
            req.reply({
              ok: true,
              status: 200,
              body: {},
            });
          }).as('postForm');

        const formListUrl = 'http://localhost:8080/shared/questionnaire'
        cy.intercept('GET', formListUrl, (req) => {
            req.reply({body: [
                {
                _id: '123',
                title: 'This is a test'
                }
            ]
            });
        }).as('fetchForms');

        cy.get('#new-form-btn').click()
        cy.url().should('eq', 'http://localhost:3000/questionnaires')
        cy.contains('This is a test').should('exist');

        cy.get('#logout-button').click()
        cy.url().should('eq', 'http://localhost:3000/login');
    })
})