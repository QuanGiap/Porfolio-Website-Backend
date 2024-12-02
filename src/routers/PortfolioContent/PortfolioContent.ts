import express from 'express';
import verifyToken from '../../handler/verifyToken';
import prisma from '../../tools/PrismaSingleton';
const portfolio_content_route = express.Router();
portfolio_content_route.post('/',verifyToken,(req,res)=>{
    //create new content
})
portfolio_content_route.get('/',(req,res)=>{
    // const {user_id,website_id} = req.params;
    const {user_id,website_id,portfolio_data_id} = req.query;
    // const contents = prisma.portfolioContent.findMany({
        where:{
            portfolioData_id
        }
    })
})
export default portfolio_content_route;