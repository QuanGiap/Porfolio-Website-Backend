import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const auth_route = express.Router();

auth_route.post('/sign_in/',(req,res)=>{
    res.send('sign_in not implemented');
})

auth_route.post('/sign_up/',(req,res)=>{
    res.send('sign_up not implemented');
})

auth_route.post('/reset_pass/',(req,res)=>{
    res.send('reset_pass not implemented');
})    

auth_route.post('/confirm/',(req,res)=>{
    res.send('confirm not implemented');
})

auth_route.post('/refresh_token/',(req,res)=>{
    res.send('refresh_token not implemented');
})

export default auth_route;
