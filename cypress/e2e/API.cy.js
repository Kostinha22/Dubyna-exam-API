///<reference types="cypress"/>
import {faker} from '@faker-js/faker'
import body from  '../fixtures/body.json'  


body.userId = faker.number.int({min:1, max: 99})
body.email = faker.email
body.firstname = faker.firstname
body.lastname = faker.lastname
body.password = faker.password



  it('1 - GET posts', () => {
    cy.log(`GET posts`)


    cy.request('GET', 'http://localhost:3000/posts').then( response => {
      cy.log(`Requst body: ${response.allRequestResponses}`)
      console.log('Response:', response)
      expect(response.status).to.be.equal(200)
      cy.log(JSON.stringify(response.body))
      expect(response.headers['content-type']).to.include('application/json')

    })
  })




  it('2 - GET 10 posts', () => {
    cy.log(`GET 10 posts`)
  
    cy.request('GET', 'http://localhost:3000/posts').then(response => {
      cy.log(`Request body: ${response.allRequestResponses}`)
      console.log('Response:', response.allRequestResponses)
      expect(response.status).to.be.equal(200)
      expect(response.headers['content-type']).to.include('application/json')
  
      const posts = response.body.slice(0, 10) 
      cy.log(JSON.stringify(posts))
  
      expect(posts).to.have.lengthOf(10)
    })
  })
  

  it('3 - GET posts with id = 55 and id = 60', () => {
    cy.log(`GET posts with id = 55 and id = 60`)
  
    /
    cy.request('GET', 'http://localhost:3000/posts').then(response => {
      cy.log(`Request body: ${response.allRequestResponses}`)
      console.log('Response:', response.allRequestResponses)
      expect(response.status).to.be.equal(200)
      expect(response.headers['content-type']).to.include('application/json')
  
      cy.log('Filter posts with id = 55 and id = 60')
      const posts = response.body.filter(post => post.id === 55 || post.id === 60)
      cy.log(JSON.stringify(posts))
  
      cy.log('Verify HTTP response status code')
      expect(response.status).to.be.equal(200)
  
      cy.log('Verify the data of posts 55 and 60')
      expect(posts).to.have.lengthOf(2) 
      expect(posts[0].id).to.be.equal(55) 
      expect(posts[1].id).to.be.equal(60) 
    })
  })


  it('4 - Create a post. Verify HTTP response status code', () => {
    cy.log('4th - Create a post. Verify HTTP response status code')
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/664/post',
      body: body,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.be.equal(401)
      cy.log(`Request body: ${response.allRequestResponses}`)
      console.log('Response:', response.allRequestResponses)
    })
  })



  it('5 - Create a new post with access token', () => {
    cy.log('Step 1 - User registration')
    const email = faker.internet.email();
    const password = faker.internet.password();
  
    cy.request({
      method: 'POST',
      url: '/register',
      body: {
        email: email,
        password: password
      }
    }).then(registerResponse => {
      expect(registerResponse.status).to.be.equal(201);
      cy.log('Registration successful');
  
     cy.log('User login')
      cy.request({
        method: 'POST',
        url: '/login',
        body: {
          email: email,
          password: password
        }
      }).then(loginResponse => {
        expect(loginResponse.status).to.be.equal(200);
        cy.log('Login successful');
  
        const accessToken = loginResponse.body.accessToken;
  
        cy.log('Create a post with access token')
        cy.request({
          method: 'POST',
          url: '/664/posts',
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: {

            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph()
          }
        }).then(createPostResponse => {
          expect(createPostResponse.status).to.be.equal(201);
          cy.log('Post created successfully');
  

          expect(createPostResponse.body.title).to.be.a('string');
          expect(createPostResponse.body.content).to.be.a('string');
        });
      });
    });
  });
  


 


  it('6 - Create a new post entity', () => {
    cy.log('Generate fake POST data')
    const post = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph()
    };
  
    cy.request({
      method: 'POST',
      url: '/posts',
      body: post,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      expect(response.status).to.be.equal(201);
      cy.log('Post entity created successfully');
  
      expect(response.body).to.include(post);
    });
  });


  it('7 - Update an non-existing entity', () => {

    cy.log('Generate fake POST data')
    const post = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph()
    };
  
    cy.request({
      method: 'PUT',
      url: '/posts',
      body: post,
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      expect(response.status).to.be.equal(404);
      cy.log('Response 404');
    });
  });
  


it('8 - Create and update a post entity', () => {
  cy.log('Generate fake POST data')
  const post = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph()
  };

  cy.request({
    method: 'POST',
    url: '/posts',
    body: post,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    expect(response.status).to.be.equal(201);
    cy.log('Post entity created successfully');

    cy.log('Update the created post entity')
    const updatedPost = {
      ...response.body,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph()
    };

    cy.request({
      method: 'PUT',
      url: `/posts/${response.body.id}`,
      body: updatedPost,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(updateResponse => {
      expect(updateResponse.status).to.be.equal(200);
      cy.log('Post entity updated successfully');

      cy.log('Verify the updated post entity')
      expect(updateResponse.body).to.deep.equal(updatedPost);
    });
  });
});


it('9 - Delete non-existing post entity', () => {


  
  cy.log('Assuming non-existing post ID is 999 (replace with the appropriate ID')
  cy.request({
    method: 'DELETE',
    url: `/posts`,
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.be.equal(404);
    cy.log('Post entity deletion failed as expected');
  });
});




it('10 - Create, update, and delete a post entity', () => {
  cy.log('Generate fake post data')
  const post = {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph()
  };

  cy.log('Create the post entity')
  cy.request({
    method: 'POST',
    url: '/posts',
    body: post,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(createResponse => {
    expect(createResponse.status).to.be.equal(201);
    cy.log('Post entity created successfully');

    cy.log('Update the created post entity')
    const updatedPost = {
      ...createResponse.body,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph()
    };

   cy.log('Update the post entity')
    cy.request({
      method: 'PUT',
      url: `/posts/${createResponse.body.id}`,
      body: updatedPost,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(updateResponse => {
      expect(updateResponse.status).to.be.equal(200);
      cy.log('Post entity updated successfully');

      cy.log('Delete the post entity') 
      cy.request({
        method: 'DELETE',
        url: `/posts/${createResponse.body.id}`,
        failOnStatusCode: false
      }).then(deleteResponse => {
        expect(deleteResponse.status).to.be.equal(200);
        cy.log('Post entity deleted successfully');
      });
    });
  });
});
