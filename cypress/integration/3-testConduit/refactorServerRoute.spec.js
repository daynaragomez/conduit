///<reference types="cypress"/>
describe('Test with backend / refactoring use intercept', () => {

    beforeEach('login to the app', () => {
      // cy.server() REFACTORING SERVER() and ROUTE for INTERCEPT()
      // cy.route('GET','**/tags','fixture:tags.json') //mocking the request by providing or creating a json file
      cy.intercept({method: 'Get',path:'tags'},{fixture:'tags.json'}) //replaced with path
      cy.loginToApplication() //this method is located commands
    })

    it('verify correct request and response', () => {

//cy.server() //crear el servidorde cypress
        cy.intercept('POST', '**/api.realworld.io/api/articles').as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('GitHub ')
        cy.get('[formcontrolname="description"]').type('code hosting platform')
        cy.get('[formcontrolname="body"]').type('version control and collaboration, lets you and others work together on projects from anywhere.')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr => {
            console.log(xhr)
           expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('version control and collaboration, lets you and others work together on projects from anywhere.')
           expect(xhr.response.body.article.description).to.equal('code hosting platform')
        })

        
    })

    it.skip('Intercepting and modifying the request and response', () => {

      //  cy.intercept('POST', '**/api.realworld.io/api/articles',(req) => {
      //     req.body.article.description = "this is another description."
      //  }).as('postArticles')  //this insterception makes change the description even if we type in few lines down
      
      cy.intercept('POST', '**/api.realworld.io/api/articles',(req) => {
        req.reply( res => { 
          expect(res.body.article.description).to.equal('code hosting platform')
          res.body.article.description = "this is another description."
      })
     }).as('postArticles') 
    
            cy.contains('New Article').click()
            cy.get('[formcontrolname="title"]').type('GitHub ')
            cy.get('[formcontrolname="description"]').type('code hosting platform')
            cy.get('[formcontrolname="body"]').type('version control and collaboration, lets you and others work together on projects from anywhere.')
            cy.contains('Publish Article').click()
        
            cy.wait('@postArticles')
            cy.get('@postArticles').then(xhr => {
                console.log(xhr)
                expect(xhr.response.statusCode).to.equal(200)
                expect(xhr.request.body.article.body).to.equal('version control and collaboration, lets you and others work together on projects from anywhere.')
                //expect(xhr.request.body.article.description).to.equal('code hosting platform')
                expect(xhr.response.body.article.description).to.equal('this is another description.') //we expet the assertion with the interception up
            })         
        
   })

    it('should gave tags with routing object ', ()=>{
            //looking in json file mocked the co
            //cy.wait(20000)
            cy.get('div .tag-list')
            .should('contain', 'cypress')
            .should('contain', 'automation')
            .should('contain', 'testing')
  
    })

    it('Verify the local feed likes count',()=>{
        cy.intercept('GET','**/articles/feed*', {"articles":[],"articlesCount":0})
        cy.intercept('GET','**/articles*', {fixture:'articles.json'})
        
        cy.contains('Global Feed').click()
        cy.get('app-article-list button')
        .then( listOfButton => {
           expect(listOfButton).to.contain('2')
          expect(listOfButton[1]).to.contain('5')
        })
        //create the route by call a fixture methode and read the fisture file articles.json
        cy.fixture('articles').then(file =>{
            const articlelink = file.articles[1].slug
            cy.intercept('POST', '**/articles/' + articlelink + '/favorite',file) //file is the respond of the link that we created
        })

        //assertion 
        cy.get('app-article-list button')
          .eq(1)
          .click()
          .should('contain','6') //because is mocked test, we do not depend on the backend server
       
    })

    it('Delete new article  in global feed', () => {
      //create a const for login and relocated at commands.js loginApplication()
      // const userCredentials =  { "user": {
      //   "email": "cytest@test.com",
      //   "password": "Welcome123"
      //  }
      // }

     const bodyRequest = {
      "article": {
          "tagList": [],
          "title": "Request from API (Postman)",
          "description": "Api testing is easy",
          "body": "angular is cool"
        }
      }
//this are in comments because we relocated at command.js or loginApplication() so 
//we use instaed cy.get
      // cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
      // .its('body').then( body => {
        cy.get('@token').then( token => {
       
        
        //2. second request from articles
        cy.request({
           url: 'https://api.realworld.io/api/articles',
           headers: {'Authorization': 'Token '+token}, //la variable guardada como se muestra en postman
           method:'POST',
           body: bodyRequest   //const created to save the body request
        }).then(response => {
          expect(response.status).to.equal(200)
        })

        //we need go into global feed
        cy.contains('Global Feed').click()
        cy.get('.article-preview').first().click()
        cy.get('.article-actions').contains('Delete Article').click()
      
      //need request our article is successfully deleted.request the list by using API
      //verifying the first artile of the list DO NOT have text "Request from API (Postman)" como arriba que creamos nosotros
        cy.request({
             url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
             headers: {'Authorization': 'Token '+token}, //la variable guardada como se muestra en postman
             method:'GET'
           }).its('body').then(body => {
             //console.log(body) //aqui probammos que en consola se imprima la lista articulos
             expect(body.articles[0].title).not.equal('Request from API (Postman)')

            })




      })


    })
 })
