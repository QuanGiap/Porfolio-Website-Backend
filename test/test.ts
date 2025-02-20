import assert from 'assert';
import server from '../src/app';
import request from 'supertest';
import prisma from '../src/tools/PrismaSingleton';
const ObjectID_dummy = '507f1f77bcf86cd799439011';
describe('Test all route API', function () {
  let website_id = '';
  //create a server
  const request_server = request(server);
  let token = '';
  let user_test_data:string[] = [];
  let portfoliodata_test_data:string[]=[];
  let portfoliodata_content:string[]=[];
  const userTestDataMain ={
    first_name:"User",
    last_name:"Test",
    user_name:"user_test",
    email:"email@gmail.com",
    password:"Thisisapassword1!"
  } 
  describe('Auth route', function () {
    it('add new user but missing info', function (done) {
      const user_missing_info={
        ...userTestDataMain,
        last_name:undefined,
      }
      request_server.post('/auth/sign_up').send(user_missing_info).end((err,response)=>{
        assert.equal(response.statusCode,400,'Status code should be 400');
        assert.equal(response.body.error,'last_name is missing in body','"error" message should be "last_name is missing in body"');
        done();
      });
    });
    it('add new user', function (done) {
      request_server.post('/auth/sign_up').send(userTestDataMain).end((err,response)=>{
        console.log(response.body);
        assert.equal(response.statusCode,201,'Status code should be 201');
        assert.equal(response.body.message,'User created, please veriy email','"message" should be "User created, please veriy email"');
        assert.ok(response.body.user_id,'user_id  not found in response');
        user_test_data.push(response.body.user_id)
        done();
      });
    });
    it('add new user with existed email or user_name', function (done) {
      request_server.post('/auth/sign_up').send(userTestDataMain).end((err,response)=>{
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
      request_server.post('/auth/sign_in').send({email:userTestDataMain.email,password:"Incorrect password"}).end((err,response)=>{
        assert.equal(response.statusCode,401,'Status code should be 401');
        assert.equal(response.body.error, 'Password not correct','error should contains "Password not correct"');
        done();
      });
    });
    //sign in user success
    it('sign in user success', function (done) {
      request_server.post('/auth/sign_in').send({email:userTestDataMain.email,password:userTestDataMain.password}).end((err,response)=>{
        assert.equal(response.statusCode,200,'Status code should be 200');
        assert.equal(response.body.message, 'Sign in success','message should contains "Sign in success"');
        assert.ok(response.body.authenticate_token, 'authenticate_token not found in response');
        done();
      });
    });
  });

  
  describe('User route', function () {
    const createUserTestData=(i:number)=>{
      return{
      first_name:"User "+i,
      last_name:"Test",
      user_name:"user_test "+i,
      email:`email${i}@gmail.com`,
      password:"Thisisapassword1!"
      }
    } 
    //create dummy user data before testing
    it('creating dummy data', function (done) {
      //create website
      prisma.websiteDesign.create({
        data:{
          url_website:"https://test.com",
          creator_id:user_test_data[0]
        }
      })
      //create users
      .then((data)=>{
        website_id = data.id;
        //add users to website
        return Promise.all([1,2,3,4,5].map((i)=>{
          return prisma.user.create({
            data:{
              ...createUserTestData(i),
            }
          })
        }))
      })
      //create portfoliodata
      .then(users=>{
        user_test_data.push(...users.map((user)=>user.id));
        return Promise.all(users.map((user)=>prisma.portfolioData.create({
          data:{
            user_id:user.id,
            website_design_id:website_id,
            title:"Portfolio Data "+user.id,
            desciption:"This is a description",
          }
        })))
      }).then(portData=>{
        portfoliodata_test_data.push(...portData.map((portData)=>portData.id));
        done();
      }).catch((err)=>{
        done(err);
      }) 
    });
    //get list of user based on invalid website_id
    it("get list of user based on invalid website_id",function(done){
      request_server.get(`/user/website_id/${ObjectID_dummy}/list`).end((err,response)=>{
        assert.equal(response.statusCode,200,"Status code should be 200)");
        assert.ok(Array.isArray(response.body.users),"User should be an array");
        assert.equal(response.body.users.length,0,"User should be empty")
        done();
      })
    })
    //get list of user base on valid website_id
    it("get list of user based on valid website_id",function(done){
      request_server.get(`/user/website_id/${website_id}/list`).end((err,response)=>{
        assert.equal(response.statusCode,200,"Status code should be 200)");
        assert.ok(Array.isArray(response.body.users),"User should be an array");
        assert.equal(response.body.users.length,5,"User should be 5")
        done();
      })
    })

    it('user login',function(done){
      request_server.post('/auth/sign_in').send({email:userTestDataMain.email,password:userTestDataMain.password}).end((err,response)=>{
        assert.equal(response.statusCode,200,'Status code should be 200');
        assert.equal(response.body.message, 'Sign in success','message should contains "Sign in success"');
        assert.ok(response.body.authenticate_token, 'authenticate_token not found in response');
        token = response.body.authenticate_token;
        done();
      });
    })
    //update user information
    it('update user information', function () {
      const user_update_data = {
        first_name:"User updated",
        last_name:"Test updated",
      }
      request_server.patch('/user').set('Authorization',
        'Bearer '+token
        
      ).send(user_update_data).end((err,response)=>{
        assert.equal(response.statusCode,200,'Status code should be 200');
        assert.equal(response.body.message,'Updated success','message should be "Updated success"');
        assert.equal(response.body.user.first_name,user_update_data.first_name,"first_name should be updated");
        assert.equal(response.body.user.last_name,user_update_data.last_name,"last_name should be updated");
      })
    });
  });

  //update port_data content non exist
  //after Achievement, Project, Experiece, and image route,get all data.
  describe('PortData route', function () {
    let port_data_id = '';
    let port_content_id = '';
    //create port_data_id with no token or invalid token
    it('create port_data_id with no token', function (done){
      request_server.post('/portfolio_content').send({
        website_id:website_id,
        title:'Portfolio Data test title',
        description:'Portfolio data test desciption',
      }).end((err,res)=>{
        assert.equal(res.statusCode,403,'Status code should be 403');
        done();
      })
    })
    //create port_data_id
    it('create port_data_id', function (done) {
      request_server.post('/portfolio_content').set('Authorization','Bearer '+token).send({
        website_id:website_id,
        title:'Portfolio Data test title',
        description:'Portfolio data test desciption',
      }).end((err,res)=>{
        assert.equal(res.statusCode,201,'Status code should be 201');
        assert.ok(res.body.data,'data not found in response');
        assert.ok(res.body.data.id,'data not found in response');
        portfoliodata_test_data.push(res.body.data.id);
        port_data_id = res.body.data.id;
        done();
      })
    });
    //create port_data content
    it('create port_data content', function (done) {
      request_server.post('/portfolio_content/content').set('Authorization','Bearer '+token).send({
        portfolio_data_id:port_data_id,
        content:'Portfolio content test',
        place_id:'place_id_001',
      }).end((err,res)=>{
        assert.equal(res.statusCode,201,'Status code should be 201');
        assert.ok(res.body.data.id,'id not found in response');
        assert.equal(res.body.data.content,'Portfolio content test','content should be "Portfolio content test"');
        port_content_id = res.body.data.id;
        portfoliodata_content.push(res.body.data.id);
        done();
      })
    });
    //update port_data content
    it('update port_data content', function (done) {
      request_server.patch('/portfolio_content/content').set('Authorization','Bearer '+token).send({
        id:port_content_id,
        content:'Portfolio content test updated',
        place_id:'place_id_002',
      }).end((err,res)=>{
        assert.equal(res.statusCode,201,'Status code should be 201');
        assert.ok(res.body.data.id,'id not found in response');
        assert.equal(res.body.data.content,'Portfolio content test updated','content should be "Portfolio content test updated"');
        assert.equal(res.body.data.place_id,'place_id_002','place_id should be "place_id_002"');
        done();
      })
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
    const portfoliodata_delete_promise = await prisma.portfolioData.deleteMany({
      where:{
        id:{
          in:portfoliodata_test_data,
        }
      }
    })
    const portfolio_content_delete_promise = await prisma.portfolioContent.deleteMany({
      where:{
        id:{
          in:portfoliodata_content,
        }
      }
    })
    const website_delete_promise = await prisma.websiteDesign.delete({
      where:{
        id:website_id,
      }
    })
    const user_delete_promise = await prisma.user.deleteMany({
      where:{
        id:{
          in:user_test_data,
        }
      }
    })
  })
});

