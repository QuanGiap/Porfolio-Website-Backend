import express from 'express';
import verifyToken from '../../handler/verifyToken';
const introduction_route = express.Router();
introduction_route.post('/',verifyToken,(req,res)=>{
    //create new introduction
})
introduction_route.patch('/',verifyToken,(req,res)=>{
    //update introduction
})
introduction_route.get('/:user_id/',(req,res)=>{
    //get introduction from user_id
})
export default introduction_route;