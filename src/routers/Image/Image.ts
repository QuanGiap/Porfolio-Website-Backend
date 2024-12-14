import express from 'express';
import verifyToken from '../../handler/verifyToken';
const image_route = express.Router();
image_route.post('/',verifyToken,(req,res)=>{
    //create new resume
})
export default image_route;