import express, { Express } from "express"; 
const user_route = express.Router();

user_route.get('/:user_id',(req,res)=>{
    //fectch user item
    let user_id = req.params.user_id;
    return res.json({
        first_name:'',
        last_name:'',
        email:'',
        url_img:'',
    })
})
user_route.post('',(req,res)=>{
    //create new user
})
user_route.patch('',(req,res)=>{
    //update new user
})

export default user_route;