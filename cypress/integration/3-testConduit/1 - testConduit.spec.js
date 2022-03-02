///<reference types="cypress"/>

const { createYield } = require("typescript")

describe ('Test with Backend!' , () => {
    beforeEach('Login the app', () => {
        cy.loginToApplication()
    })

    it('Should log in',() => {
        cy.log('Yes! logged in!')
    })
})