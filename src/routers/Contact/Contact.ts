import express from 'express';
const contact_route = express.Router();
contact_route.post('/send_email/',(req,res)=>{
    //create slow mode to avoid spamming message
})
contact_route.post('/',(req,res)=>{
    //create new contact
})
contact_route.get('/:user_id/',(req,res)=>{
    //get contact from user_ids
})
export default contact_route;