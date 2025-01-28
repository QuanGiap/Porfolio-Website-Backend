import assert from 'assert';
import server from '../src/app';
import request from 'supertest';
import prisma from '../src/tools/PrismaSingleton';
describe('Test all route API', function () {
  //create a server
  const request_server = request(server);
  let token = '';
  let user_test_data:string[] = [];
  describe('Auth route', function () {
    const userTestData ={
      first_name:"User",
      last_name:"Test",
      user_name:"user_test",
      email:"email@gmail.com",
      password:"Thisisapassword1!"
    } 
    it('add new user but missing info', function (done) {
      const user_missing_info={
        ...userTestData,
        last_name:undefined,
      }
      request_server.post('/auth/sign_up').send(user_missing_info).end((err,response)=>{
        assert.equal(response.statusCode,400,'Status code should be 400');
        assert.equal(response.body.error,'last_name is missing in body','"error" message should be "last_name is missing in body"');
        done();
      });
    });
    it('add new user', function (done) {
      request_server.post('/auth/sign_up').send(userTestData).end((err,response)=>{
        console.log(response.body);
        assert.equal(response.statusCode,201,'Status code should be 201');
        assert.equal(response.body.message,'User created, please veriy email','"message" should be "User created, please veriy email"');
        assert.ok(response.body.user_id,'user_id  not found in response');
        user_test_data.push(response.body.user_id)
        done();
      });
    });
    it('add new user with existed email or user_name', function (done) {
      request_server.post('/auth/sign_up').send(userTestData).end((err,response)=>{
        assert.equal(response.statusCode,409,'Status code should be 409');
        assert.ok(response.body.errors?.includes('User name used'),'errors should contains "User name used"');
        assert.ok(response.body.errors?.includes('Email used'),'errors should contains "Email used"');
        done();
      });
    });
    it('sign in but incorrect email', function (done) {
      request_server.post('/auth/sign_in').send({email:"not_found@test.com",password:"correct password"}).end((err,response)=>{
        assert.equal(response.statusCode,404,'Status code should be 404');
        assert.equal(response.body.error, 'User not found','error should contains "User not found"');
        done();
      });
    });
    it('sign in but incorrect password', function (done) {
      request_server.post('/auth/sign_in').send({email:userTestData.email,password:"Incorrect password"}).end((err,response)=>{
        assert.equal(response.statusCode,401,'Status code should be 401');
        assert.equal(response.body.error, 'Password not correct','error should contains "Password not correct"');
        done();
      });
    });
    //sign in user success
    it('sign in user success', function (done) {
      request_server.post('/auth/sign_in').send({email:userTestData.email,password:userTestData.password}).end((err,response)=>{
        assert.equal(response.statusCode,200,'Status code should be 200');
        assert.equal(response.body.message, 'Sign in success','message should contains "Sign in success"');
        assert.ok(response.body.authenticate_token, 'authenticate_token not found in response');
        token = response.body.authenticate_token;
        done();
      });
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
  this.afterAll(async ()=>{
    await prisma.user.deleteMany({
      where:{
        id:{
          in:user_test_data,
        }
      }
    })
  })
});

