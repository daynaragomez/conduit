///<reference types="cypress"/>
describe('Test with backend', () => {

    beforeEach('login to the app', () => {
       cy.server()
       cy.route('GET','**/tags','fixture:tags.json') //mocking the request by providing or creating a json file
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
            //looking in json file mocked 
            //cy.wait(20000)
            cy.get('div .tag-list')
            .should('contain', 'cypress')
            .should('contain', 'automation')
            .should('contain', 'testing')
  
    })

    it('Verify the local feed likes count',()=>{
        cy.route('GET','**/articles/feed*', 'fixture:{"articles":[],"articlesCount":0}')
        cy.route('GET','**/articles*', 'fixture:articles.json')
        
        cy.contains('Global Feed').click()
        cy.get('app-article-list button')
        .then( listOfButton => {
           expect(listOfButton).to.contain('2')
          expect(listOfButton[1]).to.contain('5')
        })
        //create the route by call a fixture method and read the fisture file articles.json
        cy.fixture('articles').then(file =>{
            const articlelink = file.articles[1].slug
            cy.route('POST', '**/articles/' + articlelink + '/favorite',file) //file is the respond of the link that we created
        })

        //assertion 
        cy.get('app-article-list button')
          .eq(1)
          .click()
          .should('contain','6') //because is mocked test, we do not depend on the backend server
       
    })
 })
