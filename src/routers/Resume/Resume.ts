import express from 'express';
import verifyToken from '../../handler/verifyToken';
const resume_route = express.Router();
resume_route.post('/',verifyToken,(req,res)=>{
    //create new resume
})
resume_route.patch('/',verifyToken,(req,res)=>{
    //update resume
})
resume_route.get('/:user_id/',(req,res)=>{
    //get contact from user_id
})
export default resume_route;