import express from 'express';
import verifyToken from '../../handler/verifyToken';
const about_route = express.Router();
about_route.post('/',verifyToken,(req,res)=>{
    //create new about
})
about_route.patch('/',verifyToken,(req,res)=>{
    //update about
})
about_route.get('/:user_id/',(req,res)=>{
    //get about from user_id
})
export default about_route;