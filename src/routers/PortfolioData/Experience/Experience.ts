import express from 'express';
import verifyToken from '../../handler/VerifyToken';
const experience_route = express.Router();
experience_route.post('/',verifyToken,(req,res)=>{
    //create new about
})
experience_route.patch('/',verifyToken,(req,res)=>{
    //update about
})
experience_route.get('/:user_id/',(req,res)=>{
    //get about from user_id
})
export default experience_route;