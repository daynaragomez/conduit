// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('loginToApplication', () => {
  
//esta es la forma manual
//   cy.visit('/login')
//   cy.get('placeholder="Email"').type('cytest@test.com')
//   cy.get('placeholder="Password"').type('Welcome123')
//   cy.get('form').submit()

//aqui usaremos request API y storage at the browser


const userCredentials =  { "user": {
    "email": "cytest@test.com",
    "password": "Welcome123"
   }
  }

cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
      .its('body').then (body =>{
        const token = body.user.token
        cy.wrap(token).as('token') //aqui estamos guardando el pass de seguridad 

        //after login in, we need visit home page
        cy.visit('/', {
            onBeforeLoad(win){
                win.localStorage.setItem('jwtToken',token)
            }
        })
      })




})
