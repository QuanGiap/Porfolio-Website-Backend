import express from 'express';
import verifyToken from '../../tools/verifyToken';
const project_route = express.Router();

project_route.get('/:user_id',(req,res)=>{
    res.json({
        projects:[],
    })
})
project_route.post('/',verifyToken,(req,res)=>{
    res.json({
        message:'Project created',
    }).status(202);
})
project_route.patch('/',verifyToken,(req,res)=>{
    res.json({
        message:'Project updated',
    }).status(200);
});
export default project_route;