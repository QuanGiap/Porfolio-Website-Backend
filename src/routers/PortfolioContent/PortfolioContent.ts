import express from 'express';
import verifyToken from '../../handler/verifyToken';
import prisma from '../../tools/PrismaSingleton';
import { checkValidInput } from '../../tools/SchemaTool';
import { user_id_schema, user_name_schema, website_id_schema } from './schema';
import { createErrRes } from '../../tools/ResTool';
const portfolio_content_route = express.Router();
portfolio_content_route.post('/',verifyToken,(req,res)=>{
    //create new content
    res.send('post content is not implemented')
})
portfolio_content_route.get('/',async (req,res)=>{
    const {website_id,user_name,user_id} = req.query;
    const errors = [];
    const {err_message,parsed_data} = checkValidInput([website_id_schema],[website_id]);
    if(err_message.error){
        return createErrRes({...err_message,res});
    }
    if(!user_name&&!user_id){
        const err_msg = 'Need user_name or user_id in query url';
        return createErrRes({error:err_msg,res});
    }
    //check if exist
    let schemaCheck = user_id? user_id_schema : user_id_schema;
    let inputCheck = user_id || user_name;
    const valid_result = checkValidInput([schemaCheck],[inputCheck]);
    if(valid_result.err_message.error){
        return createErrRes({error:valid_result.err_message.error,res});
    }
    const whereQuery:{[key:string]:string} = {};
    whereQuery[user_id? 'id':'user_name'] =valid_result.parsed_data[0];
    const user = prisma.user.findFirst({where:whereQuery}); 
    if(!user){
        return createErrRes({error:'User not found',status_code:404,res});
    }
    // const website_id = await;
    // const contents = await prisma.portfolioContent.findMany({
    //     where:{
    //         portfolioData_id:portfolio_data_id,
    //     }
    // })
    // const portfolioData_id= await prisma.portfolioData.findFirst({

    // })
    // const imgs = await prisma.portfolioImage.findMany({
    //     where:{
    //         portfolioData_id:
    //     }
    // })
    // return res.json({contents:contents})
})
export default portfolio_content_route;