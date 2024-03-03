/// <reference types="cypress" />

describe('Teacher', () => {
    const questionnaireUrl = 'http://localhost:3000/shared/questionnaire/123'
    const answerListUrl = 'http://localhost:3000/teacher/questionnaire/123/answers/64f72b4e06c0818813902624'
    const studentListUrl = 'http://localhost:3000/teacher/questionnaire/123/students'

    const questionnaireResponse = {
        _id: '123',
        classes: [{ _id: '64f72b4d06c0818813902612', name: '200' }],
        createdBy: {
        _id: '64f72b4e06c0818813902620',
        email: 'teacher1@schood.fr',
        firstname: 'teacher1',
        lastname: 'teacher1'
        },
        questions: [
        {
            _id: '64fb230269a0b02380ee32a7',
            answers: [],
            title: 'Comment te sens-tu à propos de ce test ?',
            type: 'emoji'
        },
        {
            _id: '64fb230269a0b02380ee32a8',
            answers: [],
            title: 'Elabores sur ta réponse à la question précédente',
            type: 'text'
        },
        {
            _id: '64fb230269a0b02380ee32a9',
            answers: [
            {
                _id: '64fb230269a0b02380ee32ab',
                position: 0,
                title: 'oui'
            },
            {
                _id: '64fb230269a0b02380ee32ac',
                position: 1,
                title: 'non'
            }
            ],
            title: 'Est-ce que le texte fonctionne ?',
            type: 'multiple'
        }
        ],
        fromDate: '2023-09-03T00:00:00.000Z',
        title: 'Questionnaire test',
        toDate: '2023-09-09T00:00:00.000Z'
    }

    const studentsResponse = [
        {
        _id: 1,
        users: [
            {
            _id: '64f72b4e06c0818813902624',
            classes: ['64f72b4d06c0818813902612'],
            email: 'student1@schood.fr',
            firstname: 'student1',
            lastname: 'student1'
            }
        ]
        }
    ]

    const answersResponse = [
        {
        _id: '64fb242c19b9a22c8a0cde63',
        answers: [
            { question: '64fb230269a0b02380ee32a7', answer: '1', _id: '64fb242c19b9a22c8a0cde64' },
            { question: '64fb230269a0b02380ee32a8', answer: 'Bof', _id: '64fb242c19b9a22c8a0cde65' },
            { question: '64fb230269a0b02380ee32a9', answer: '0', _id: '64fb242c19b9a22c8a0cde66' }
        ],
        createdBy: {
            _id: '64f72b4e06c0818813902624',
            email: 'student1@schood.fr',
            firstname: 'student1',
            lastname: 'student1'
        },
        date: '2023-09-08T00:00:00.000Z',
        questionnaire: '123'
        }
    ]

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

        const formUrl = 'http://localhost:8080/teacher/questionnaire'
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

        cy.intercept('GET', questionnaireUrl, (req) => {
            req.reply({ body: questionnaireResponse });
        }).as('fetchForm');

        cy.intercept('GET', studentListUrl, (req) => {
            req.reply({ body: studentsResponse });
        }).as('fetchStudents');

        cy.intercept('GET', answerListUrl, (req) => {
            req.reply({ body: answersResponse });
        }).as('fetchAnswers');

        cy.get('#access-btn-0').click()
        cy.url().should('eq', 'http://localhost:3000/questionnaire/123')

        cy.get('#logout-button').click()
        cy.url().should('eq', 'http://localhost:3000/login')
    })
})