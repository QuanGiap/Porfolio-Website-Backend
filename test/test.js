import assert from 'assert';
import chaiHttp from 'chai-http';
import chai from 'chai';
import server from '../src/app'
chai.use(chaiHttp)
describe('Test all route API', function () {
  //create a server
  const request = chai.request.Request(app).keepOpen();
  let token = '';
  let userTestData = [];
  describe('Auth route', function () {
    //add new user but missing info
    //add new user
    //add new user with existed email or user_name
    //sign in but incorrect email
    //sign in but incorrect pass
    //sign in user success
    it('should return -1 when the value is not present', function (done) {
      // assert.equal([1, 2, 3].indexOf(4), -1);
      done();
    });
  });

  //create dummy user data before testing
  //get list of user based on invalid website_id
  //get list of user base on valid website_id
  //update user information with no token or invalid token
  //update user information with exist user_name
  //update user information with invalid data
  //update user information with valid data
  describe('User route', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });

  //create port_data_id with no token or invalid token
  //create port_data_id
  //create port_data content
  //update port_data content
  //update port_data content non exist
  //after Achievement, Project, Experience, and image route,get all data.
  describe('PortData route', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  //create achievement with no token
  //create achievement with invalid data
  //create achievement
  //update achievement with no token
  //update achievement with invalid data
  //update achievement
  //get achievement with no website_id
  //get achievement with no user_name,user_id
  //get achievement with not user_name
  //get achievement with not user_id
  //delete achievement with no token
  //delete achievement with invalid id
  //delete achievement
  describe('Achievement route', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  //create Project with no token
  //create Project with invalid data
  //create Project
  //update Project with no token
  //update Project with invalid data
  //update Project
  //get Project with no website_id
  //get Project with no user_name,user_id
  //get Project with not user_name
  //get Project with not user_id
  //delete Project with no token
  //delete Project with invalid id
  //delete Project
  describe('Project route', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  //create achievement with no token
  //create achievement with invalid data
  //create achievement
  //update achievement with no token
  //update achievement with invalid data
  //update achievement
  //get achievement with no website_id
  //get achievement with no user_name,user_id
  //get achievement with not user_name
  //get achievement with not user_id
  //delete achievement with no token
  //delete achievement with invalid id
  //delete achievement
  describe('Experience route', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  //create Image achievement with no token
  //create Image achievement with invalid data
  //create Image achievement
  //Update Image achievement with more image than slot
  //Update Image achievement with invalid id image
  //create Image Project
  //create Image Experience
  //create Image User
  //Update Image User (same route with create)
  //create Image Content
  //update Image Content no token
  //update Image Content invalid id
  //update Image Content not owned
  describe('Image route', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
  //close server
  //delete all test data
  this.afterAll(()=>{
    request.close();
  })
});

