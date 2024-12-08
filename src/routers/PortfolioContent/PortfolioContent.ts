import express from 'express';
import verifyToken from '../../handler/verifyToken';
import prisma from '../../tools/PrismaSingleton';
const portfolio_content_route = express.Router();
portfolio_content_route.post('/',verifyToken,(req,res)=>{
    //create new content
})
portfolio_content_route.get('/:portfolio_data_id',async (req,res)=>{
    const {portfolio_data_id} = req.params;
    const contents = await prisma.portfolioContent.findMany({
        where:{
            portfolioData_id:portfolio_data_id,
        }
    })
    const imgs = await prisma.portfolioImage.findMany({
        where:{
            portfolioData_id:
        }
    })
    return res.json({contents:contents})
})
export default portfolio_content_route;