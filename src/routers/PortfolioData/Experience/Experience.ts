import express from 'express';
import verifyToken from '../../../handler/VerifyToken';
import { checkValidInput } from '../../../tools/SchemaTool';
import prisma from '../../../tools/PrismaSingleton';
import { createErrRes } from '../../../tools/ResTool';
import { UserType } from '../../../type/Type';
import { delete_schema, patch_schema, post_schema } from './schema';
import checkOwner from '../../../tools/IsOwner';
import { DataType } from '../../../Enum/Enum';
const experience_route = express.Router();

/**
 * Create new experience 
 */
experience_route.post('/',verifyToken,async (req,res)=>{
    const user = req.body.user as UserType;
    const {parsed_data,err_message} = checkValidInput([post_schema],[req.body]);
    if(err_message.error){
        return createErrRes({...err_message,res});
    }
    const user_input = parsed_data[0];
    // check owner
    const resultCheckOwn = await checkOwner(DataType.PORTFOLIO_DATA,user_input.portfolio_data_id,user.id);
    if(!resultCheckOwn.exist){
        return createErrRes({error:'Portfolio data not found',res,status_code:404});
    }
    if(!resultCheckOwn.owned){
        return createErrRes({error:'Forbidden',res,status_code:401});
    }
    const experience = await prisma.experience.create({
        data:{
            ...user_input,
            portfolioData_id:user_input.portfolio_data_id,
        }
    })
    return res.json({message:"Create success",experience})
})

/**
 * Update experience base on id 
 */
experience_route.patch('/',verifyToken,async (req,res)=>{
    const user = req.body.user as UserType;
    const {parsed_data,err_message} = checkValidInput([patch_schema],[req.body]);
    if(err_message.error){
        return createErrRes({...err_message,res});
    }
    const user_input = parsed_data[0];
    // check owner
    const resultCheckOwn = await checkOwner(DataType.EXPERICENCE,user_input.id,user.id);
    if(!resultCheckOwn.exist){
        return createErrRes({error:'Experience data not found',res,status_code:404});
    }
    if(!resultCheckOwn.owned){
        return createErrRes({error:'Forbidden',res,status_code:401});
    }
    const experience = await prisma.experience.update({
        where:{
            id:user_input.id,
        },
        data:{
            ...user_input,
            last_update:new Date().toISOString(),
        }
    })
    return res.json({message:"Update success",experience})
})

/**
 * Delete experience base on id 
 */
experience_route.delete('/',verifyToken,async (req,res)=>{
    const user = req.body.user as UserType;
    const {parsed_data,err_message} = checkValidInput([delete_schema],[req.body]);
    if(err_message.error){
        return createErrRes({...err_message,res});
    }
    const user_input = parsed_data[0];
    // check owner
    const resultCheckOwn = await checkOwner(DataType.EXPERICENCE,user_input.id,user.id);
    if(!resultCheckOwn.exist){
        return createErrRes({error:'experience data not found',res,status_code:404});
    }
    if(!resultCheckOwn.owned){
        return createErrRes({error:'Forbidden',res,status_code:401});
    }
    const experience = await prisma.experience.delete({
        where:{
            id:user_input.id,
        },
    })
    return res.json({message:"Delete success",experience})
})

/**
 * Get experiences base on user_id or user_name 
 */
experience_route.get('/',async (req,res)=>{
    const {user_name,user_id,website_id} = req.query;
    let cur_user_id = user_id;
    const errors = []
    if(!user_name&&!user_id){
        errors.push('Require user_name or user_id in query');
    }
    if(!website_id){
        errors.push('Require website_id in query');
    }
    if(errors.length!==0){
        return createErrRes({error:errors[0],errors,res});
    }
    if(!user_id){
        const user = await prisma.user.findFirst({where:{
            //user_name exist if user_id not exist due to first condition
            user_name:user_name as string,
        },select:{
            id:true,
        }})
        if(!user){
            return createErrRes({error:'User not found',res,status_code:404});
        }
        cur_user_id = user.id;
    }
    const experiences = await prisma.experience.findMany({
        where:{
            portfolioData:{
                user_id:cur_user_id as string,
                website_design_id:website_id as string,
            }
        },
    })
    return res.json({experiences});
})
export default experience_route;