///<reference types="cypress"/>
describe('Test with backend', () => {

    beforeEach('login to the app', () => {
       cy.server()
       cy.route('GET','**/tags','fixture:tags.json')
        cy.loginToApplication()
    })

    it.skip('verify correct request and response', () => {

        cy.server() //crear el servidorde cypress
        cy.route('POST', '**/articles').as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('GitHub ')
        cy.get('[formcontrolname="description"]').type('code hosting platform')
        cy.get('[formcontrolname="body"]').type('version control and collaboration, lets you and others work together on projects from anywhere.')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr => {
            console.log(xhr)
            expect(xhr.status).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('version control and collaboration, lets you and others work together on projects from anywhere.')
            expect(xhr.request.body.article.description).to.equal('code hosting platform')
            expect(xhr.response.body.article.description).to.equal('code hosting platform')
        })

        
    })
        it('should gave tags with routing object ', ()=>{
            
            //cy.wait(20000)
            //console.log(tag)
            cy.get('div .tag-list')
            .should('contain', 'cypress')
            .should('contain', 'automation')
            .should('contain', 'testing')
  
        })
 })
