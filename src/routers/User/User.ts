import express from "express"; 
import { checkValidInput } from "../../tools/SchemaTool";
import { patch_schema, website_id_schema } from "./schema";
import { createErrRes } from "../../tools/ResTool";
import prisma from "../../tools/PrismaSingleton";
import verifyToken from "../../handler/VerifyToken";
import { UserType } from "../../type/Type";
import UserInputFilter from "../../tools/UserInputFilter";
const user_route = express.Router();


/**
 * Get a list of user_name and id base on website_id
 */
user_route.get('/website_id/:website_id/list',async (req,res)=>{
    //fectch user item
    let website_id = req.params.website_id;
    const {parsed_data,err_message} = checkValidInput([website_id_schema],[website_id]);
    if(err_message.error){
        return createErrRes({...err_message,res});
    }
    const data = await prisma.portfolioData.findMany({
        where:{
            website_design_id:website_id,
        },
        select:{
            user:{
                select:{
                    user_name:true,
                    id:true,
                    img_id:true
                }
            }
        }
    })
    return res.json({
        users:data.map(({user})=>({
            user_name:user.user_name,
            id:user.id,
            img_url:(user.img_id)? `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${user.img_id}.jpg`:null,
        })),
    })
})

/**
 * Update user information
 */
user_route.patch('/',verifyToken,async (req,res)=>{
    // req.user from verifyToken
    const user = req.user as UserType;
    const {parsed_data,err_message} = checkValidInput([patch_schema],[req.body])
    if(err_message.error){
        return createErrRes({...err_message,res});
    }
    const user_input = parsed_data[0];
    const dataUpdate = UserInputFilter(user_input,['id']);
    //update user
    if(user_input.user_name){
        //check if user_name unique
        const user_name_count = await prisma.user.count({
            where:{
                user_name:user_input.user_name,
            }
        })
        if(user_name_count!==0){
            return createErrRes({res,error:'User_name exist',status_code:409});
        }
    }
    await prisma.user.update({
        where:{
            id:user.id,
        },
        data:{
            ...dataUpdate,
            last_update:new Date().toISOString(),
        },
    })
    return res.json({message:'Updated success'})
})

export default user_route;